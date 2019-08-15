var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var App = express();
var dbConn = require('./mariadbConn');
var net = require('net');
var server = net.createServer(function(client){
   console.log('Client connected');
   client.on('data', function(data){
        var aaa = data.toJSON();
        console.log('Client sent '+ aaa.temperature1);
   });
   client.on('end', function(){
      console.log('Client disconnected');
   });
   client.write('Hello');
});
server.listen(8100, function(){
   console.log('Server listening for connection on port 8100..')
});

// db연결 및 바로 실행하는 부분. 일단... express로 데이터부터 보내기 테스트. 
// dbConn.firstTest().catch(
//     (err) =>{
//         console.log(err);
//     }
// );

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));
App.use(express.static('views/cssAndpics'));

App.get('/', function(req,res){
    console.log("Get request arrived. index.html is sent.");
    res.sendFile(path.join(__dirname,'views','index.html'));
});

// App.get('/sensorData.do', function(req,res){
//     console.log("Sensor data");
//     res.sendFile(path.join(__dirname,'views','index.html'));
// });

App.listen(5000, function(){
    console.log('listening on 5000');
});