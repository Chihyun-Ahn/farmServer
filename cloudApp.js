var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cloudApp = express();
var dbConn = require('./mariadbConn');
var timeConv = require('./timeConvert');
var portNum = 5000;

var dataBean = require('./dataBean');

cloudApp.get('/', function(){
    console.log('Home web.');
});

cloudApp.get('/redirect.do', function(req, res){
    console.log('Redirects to origin');
    res.redirect('/');
});

cloudApp.listen(portNum, function(){
    console.log('Listening on port: '+portNum);
});