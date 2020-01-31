//###########################################################################################
//#####################################초기화################################################

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cloudApp = express();
const dbConn = require('./mariadbConn');
const timeConv = require('./timeConvert');
const portNum = 5000;
const fogAddress = 'http://223.194.33.67:10033';

const interServerSocketIO = require('socket.io-client');
var interServerSocket = interServerSocketIO(fogAddress);

var dataBean = require('./dataBean');
var currentUser = 'none';

cloudApp.use(bodyParser.json());
cloudApp.use(bodyParser.urlencoded({extended: true}));
cloudApp.use(express.static('views/cssAndpics'));
cloudApp.use('/socket.io', express.static('node_modules/socket.io'));
cloudApp.use(cors());

//UI용 소켓 만들기
var http = require('http').Server(cloudApp);
var io = require('socket.io')(http);
// var socketGlobal = 'none';

//###########################################################################################
//###################################서버 간 소켓 통신#######################################

interServerSocket.emit('haha', {user: 'chihyun'});
interServerSocket.on('answer', function(data){
    console.log(data.answer);
});
interServerSocket.on('house1Msg', function(data){
    console.log('House1MsgTime received.');
    // console.log(data.);
});

//###########################################################################################
//#################################http GET, POST 통신#######################################
cloudApp.get('/', function(req, res){
    console.log('This is the home address.');
    console.log('Redirecting to the login page.');
    res.redirect('/login.do');
});

cloudApp.get('/login.do', function(req, res){
    console.log('Entered login page.');
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

cloudApp.get('/pastdatapage.do', function(req, res){
    console.log('cloudApp.get: pastdatapage.do received.');
    currentUser = req.query.user;
    console.log('User: '+currentUser);
    res.sendFile(path.join(__dirname, 'views', 'pastdatapage.html'));
});

cloudApp.post('/loginClick.do', function(req, res){
    console.log('Log-in button was clicked.');
    var id = req.body.logID;
    var pw = req.body.password;
    console.log('id: '+id, 'pw: '+pw);
    console.log(req.body);

    dbConn.loginQuery(id, pw).then(function(resultValue){
        if(resultValue == 'No id' || resultValue == 'Wrong password'){
            console.log('아이디/비밀번호가 일치하지 않습니다.');
            res.sendFile(path.join(__dirname, 'views', 'index.html'));
        }else{
            console.log(resultValue.id+'님 환영합니다. ');
            res.redirect(fogAddress+'/realdata.do?user='+resultValue.id);
        }
    });
});

cloudApp.post('/setData.do', function(req, res){
    console.log('setData.do. requested.');
    res.redirect(fogAddress+'/realdata.do');
});

//http 리스너
http.listen(portNum, function(){
    console.log('Listening on port: '+portNum);
});

//###########################################################################################
//#########################################소켓통신##########################################
io.on('connection', function(socket){
    socketGlobal = socket;
    console.log('Socket.io: connected.');
    socket.on('disconnect', function(){
        console.log('User '+currentUser+' disconnected.');
    });
    socket.on('pastdataInitials', function(){
        socket.emit('currentUser', currentUser);
    });
});