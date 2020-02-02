//###########################################################################################
//#####################################초기화################################################

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cloudApp = express();
const dbConn = require('./mariadbConn');
const timeGetter = require('./timeConvert');
const portNum = 5000;
const fogAddress = 'http://223.194.33.67:10033';

const interServerSocketIO = require('socket.io-client');
var interServerSocket = interServerSocketIO(fogAddress);

var dataBean = require('./dataBean');
var currentUser = 'none';

var timeDiff = [0,0,0,0,0,0,0,0,0,0]; //For time synching
var timeDiffSum = 0;
var timeDiffAvg = 0;

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
//###################################Time sync###############################################
var time1, time2, rtt, oneWayDelay, fogRcvTime, estimatedFogTime, timeDiffImsi, IDNum, IDNumRcv;
setInterval(function(){
    IDNum = parseInt(Math.random()*1000);
    time1 = timeGetter.nowMilli();
    interServerSocket.emit('cloudTimeSyncReq', IDNum);
    console.log('IDNum sent: '+IDNum);
},4500);

interServerSocket.on('cloudTimeSyncRes',function(data){
    time2 = timeGetter.nowMilli();
    IDNumRcv = data.IDNum;
    console.log('IDNum received: '+IDNumRcv);
    if(IDNum == IDNumRcv){
        fogRcvTime = data.fogTime;
        rtt = time2 - time1;
        onwWayDelay = Math.round(rtt / 2.0);
        estimatedFogTime = time1 + onwWayDelay;
        timeDiffImsi = estimatedFogTime - fogRcvTime;    

        for(i=0;i<timeDiff.length;i++){
            if(i!=timeDiff.length-1){
                timeDiff[i] = timeDiff[i+1];
            }else if(i==timeDiff.length-1){
                timeDiff[i] = timeDiffImsi;
            }
        }
        timeDiffSum = 0;
        for(i=0;i<timeDiff.length;i++){
        timeDiffSum += timeDiff[i];
        }
        timeDiffAvg = Math.round((timeDiffSum/(1.0*timeDiff.length)));
        console.log('Departure time: '+time1+' Arrival time: '+time2+' oneWayDelay: '+oneWayDelay);
        console.log('Fog received time: '+fogRcvTime+' Estimated fog rcv time: '+estimatedFogTime);
        console.log('Time difference: '+timeDiffImsi+' timeDiffSum: '+timeDiffSum+' timeDiff: '+timeDiff+' timeDiffAvg: '+timeDiffAvg);
    }else{
        console.log('TimeSync: idNum is different.');
    }
});

//###########################################################################################
//###################################서버 간 소켓 통신#######################################

interServerSocket.on('house1Msg', function(databean){
    var cloudArrTimeMilli = timeGetter.nowMilli() + timeDiffAvg;
    databean.house[0].cloudArrTime = timeGetter.millToTime(cloudArrTimeMilli);
    console.log('house1Msg received.');
    var msgID = databean.house[0].msgID;
    var msgID4Digits = msgID.substr(10,4);
    var msgIDLast, msgIDLast4Digits, saveParam;
    dbConn.getTheLastRow('house1').catch(
        (err)=>{console.log(err);}
    ).then(
        (result)=>{
            msgIDLast = result[0].msgID;
            msgIDLast4Digits = msgIDLast.substr(10,4);
            saveParam = msgID4Digits - msgIDLast4Digits;
            if(saveParam>=600){
                dbConn.insertDataToCloud(databean, 'house1');
            }
        }
    );
});

interServerSocket.on('house2Msg', function(databean){
    databean.house[1].cloudArrTime = timeGetter.now();
    console.log('house2Msg received.');
    var msgID = databean.house[1].msgID;
    var msgID4Digits = msgID.substr(10,4);
    var msgIDLast, msgIDLast4Digits, saveParam;
    dbConn.getTheLastRow('house2').catch(
        (err)=>{console.log(err);}
    ).then(
        (result)=>{
            msgIDLast = result[0].msgID;
            msgIDLast4Digits = msgIDLast.substr(10,4);
            saveParam = msgID4Digits - msgIDLast4Digits;
            if(saveParam>=600){
                dbConn.insertDataToCloud(databean, 'house2');
            }
        }
    );
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