const express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cloudApp = express();
var dbConn = require('./mariadbConn');
var timeConv = require('./timeConvert');
var portNum = 5000;
var dataBean = require('./dataBean');
var fogAddress = '223.194.33.67:10033';

cloudApp.use(bodyParser.json());
cloudApp.use(bodyParser.urlencoded({extended: true}));
cloudApp.use(express.static('views/cssAndpics'));
cloudApp.get('/login.do', function(req, res){
    console.log('Log-in.');
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

cloudApp.get('/test.do', function(req, res){
    console.log('/test.do entered.');
    // res.redirect('http://223.194.33.67:10033');
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
        }
    });
});

cloudApp.get('/redirect.do', function(req, res){
    console.log('Redirects to origin******');
    res.redirect('/');
    // res.redirect('/login.do');
});

cloudApp.get('/', function(req, res){
    console.log('Origin');
});

cloudApp.listen(portNum, function(){
    console.log('Listening on port: '+portNum);
});








// const mariadb = require('mariadb');
// const timeConv = require('./timeConvert');

// const pool = mariadb.createPool({
//     host: 'localhost',
//     user: 'admin',
//     password: '1234',
//     connectionLimit: 5
// });

// async function loginQuery(id, pw){
//     let conn, result, resultValue;
//     var sql = 'SELECT id, password FROM identification WHERE id = ?';
//     try{
//         conn = await pool.getConnection();
//         await conn.query('Use farmData');
//         result = await conn.query(sql, id);
//     }catch(err){
//         console.log(err)
//     }finally{
//         if(conn) conn.end();
//         console.log(result);
//         if(result[0] == null){
//             resultValue = 'No result';
//         }else{
//             resultValue = {id: result[0].id, pw: result[0].password};
//             console.log(resultValue.id);
//             console.log(resultValue.pw);
//         }
//         return resultValue;
//     }
// }

// loginQuery('abcd1', '1234').then(function(resultValue){
//     if(resultValue == 'No result'){
//         console.log('No result');
//     }else{
//         console.log(resultValue.id);
//         console.log(resultValue.pw);
//     }
// });

// loginQuery('ab1', '1234').then(function(resultValue){
//     if(resultValue == 'No result'){
//         console.log('No result');
//     }else{
//         console.log(resultValue.id);
//         console.log(resultValue.pw);
//     }
// });