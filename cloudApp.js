const express = require('express');
const cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
const cloudApp = express();
var dbConn = require('./mariadbConn');
var timeConv = require('./timeConvert');
var portNum = 5000;
var dataBean = require('./dataBean');
var fogAddress = 'http://223.194.33.67:10033';

cloudApp.use(bodyParser.json());
cloudApp.use(bodyParser.urlencoded({extended: true}));
cloudApp.use(express.static('views/cssAndpics'));
cloudApp.use(cors());

cloudApp.get('/', function(req, res){
    console.log('This is the home address.');
    console.log('Redirecting to the login page.');
    res.redirect('/login.do');
});

cloudApp.get('/ddd.do', function(req, res){
    console.log('==============');
    res.redirect('/dddd.do');
});

cloudApp.get('/dddd.do', function(req, res){
    console.log('######========');
    res.sendFile(path.join(__dirname, 'views', 'indexOld.html'));
});


cloudApp.get('/login.do', function(req, res){
    console.log('Entered login page.');
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

cloudApp.post('/loginClick.do', function(req, res){
    console.log('Log-in button was clicked.');
    var id = req.body.id;
    var pw = req.body.pw;

    dbConn.loginQuery(id, pw).then(function(resultValue){
        if(resultValue == 'No id' || resultValue == 'Wrong password'){
            console.log('아이디/비밀번호가 일치하지 않습니다.');
            res.send(resultValue);
        }else{
            console.log(resultValue.id+'님 환영합니다. ');
            res.send('clear');
        }
    });
});

cloudApp.listen(portNum, function(){
    console.log('Listening on port: '+portNum);
});

