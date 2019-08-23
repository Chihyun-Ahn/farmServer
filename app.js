var express         = require('express');
var path            = require('path');
var bodyParser      = require('body-parser');
var app             = express();
var dbConn          = require('./mariadbConn');

//전역 변수로 데이터빈 객체 사용
var dataBean        = require('./dataBean');
const io            = require('socket.io');
const socketServer  = io.listen(3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views/cssAndpics'));

app.get('/', function(req,res){
    console.log("Get request arrived. index.html is sent.");
    res.sendFile(path.join(__dirname,'views','index.html'));
});

//프런트에서 getData.do 요청이 오면, 응답으로 데이터빈을 보냄. 
app.post('/getData.do', function(req,res){
    console.log('getData.do request received.');
    console.log(req.body.userData);
    res.send(dataBean);
});

//웹 서버 리스너
app.listen(5000, function(){
    console.log('listening on 5000');
});

//농장 서버와 소켓통신 리스너
socketServer.on("connection", function(socket){
    console.log('user connected');

    //농장 서버에다가 매 20초마다 'giveMeData'요청을 보낸다. 
    setInterval(()=>{
        socket.emit('giveMeData');
    }, 20000);

    //농장 서버에서 giveMeData 요청에 대한 응답으로 농장 센서 데이터값을 보내온다. 
    socket.on('farmInfo',(farmInfo)=>{
        console.log('farmInfo received. current time: '+ new Date());
        // 먼저 DB에다가 저장을 한다.  
        dbConn.insertData(farmInfo).catch(
            (err) =>{
                console.log(err);
            }
        );

        // 데이터빈에 저장한다. 
        for(i=0;i<2;i++){
            dataBean.houseData[i].temp1   = farmInfo[i].temperature1;
            dataBean.houseData[i].temp2   = farmInfo[i].temperature2;
            dataBean.houseData[i].humid1  = farmInfo[i].humidity1;
            dataBean.houseData[i].humid2  = farmInfo[i].humidity2;
            dataBean.houseData[i].msgTime = farmInfo[i].sigTime;
        }
    }); 
});

// //매 1분마다 DB에 데이터빈 값을 저장한다. 
// setInverval(()=>{
//     dbConn.insertData(farmInfo).catch(
//         (err) =>{
//             console.log(err);
//         }
//     );
// },60000);