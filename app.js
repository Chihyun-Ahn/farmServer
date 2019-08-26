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

//프런트에서 사용자가 설정값을 입력하면, 그것에 대한 응답. 
app.post('/setData.do', function(req,res){
    console.log('setData.do request received.');
    dataBean.house[0].tarTemp   = req.body.house1TarTemp;
    dataBean.house[0].tempBand  = req.body.house1TempBand;
    dataBean.house[1].tarTemp   = req.body.house2TarTemp;
    dataBean.house[1].tempBand  = req.body.house2TempBand;
    res.sendFile(path.join(__dirname,'views','index.html'));
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
    }, 10000);

    //농장 서버에서 giveMeData 요청에 대한 응답으로 농장 센서 데이터값을 보내온다. 
    socket.on('farmInfo',(farmInfo)=>{
        console.log('farmInfo received. current time: '+ new Date());
        // 데이터빈에 저장한다. 
        for(i=0;i<2;i++){
            dataBean.house[i].temp1     = farmInfo[i].temperature1;
            dataBean.house[i].temp2     = farmInfo[i].temperature2;
            dataBean.house[i].avgTemp   = Math.round((farmInfo[i].temperature1 + farmInfo[i].temperature2)/2);
            dataBean.house[i].humid1    = farmInfo[i].humidity1;
            dataBean.house[i].humid2    = farmInfo[i].humidity2;
            dataBean.house[i].avgHumid  = Math.round((farmInfo[i].humidity1 + farmInfo[i].humidity2)/2);
            dataBean.house[i].msgTime   = farmInfo[i].sigTime;

            // 환기량 계산 후 팬 가동
            dataBean.house[i].ventilPer = Math.round(((dataBean.house[i].avgTemp - dataBean.house[i].tarTemp)/dataBean.house[i].tempBand)*100);
            if(dataBean.house[i].fanMode == 0){
                if(dataBean.house[i].ventilPer < 33){
                    dataBean.house[i].fan1 = 1;
                    dataBean.house[i].fan2 = 0;
                    dataBean.house[i].fan3 = 0;
                }else if(dataBean.house[i].ventilPer >= 33 && dataBean.house[i].ventilPer < 66){
                    dataBean.house[i].fan1 = 1;
                    dataBean.house[i].fan2 = 1;
                    dataBean.house[i].fan3 = 0;
                }else if(dataBean.house[i].ventilPer >= 66){
                    dataBean.house[i].fan1 = 1;
                    dataBean.house[i].fan2 = 1;
                    dataBean.house[i].fan3 = 1;
                    //고온 알람
                    if(dataBean.house[i].ventilPer > 120){
                        dataBean.house[i].alarm = 1;
                    }
                }    
            }
        
            // 습도에 따른 가습기 제어
            if(dataBean.house[i].waterMode == 0){
                if(dataBean.house[i].avgHumid < 70){
                    dataBean.house[i].water = 0;
                }else if(dataBean.house[i].avgHumid >= 70){
                    dataBean.house[i].water = 1;
                }
            }
        }
        console.log('controlData will be sent to the gateWay.');
        socket.emit('controlData', dataBean);
    }); 
});

//매 1분마다 DB에 데이터빈 값을 저장한다. 
setInterval(()=>{
    dbConn.insertData(dataBean).catch(
        (err) =>{
            console.log(err);
        }
    );
    // dbConn.selectData('house1').catch(
    //     (err) => {
    //         console.log(err);
    //     }
    // ).then((result)=>{
    //     dataBean.house[0].
        
    //     console.log(result[0].temp1);
    // });
},5000);