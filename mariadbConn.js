const mariadb = require('mariadb');
const timeConv = require('./timeConvert');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'admin',
    password: '1234',
    connectionLimit: 5
});

async function insertData(dataBean){
    let conn;
    try{
        conn = await pool.getConnection();
        conn.query('USE farmData');
        var sql1 = 'INSERT INTO House1(msgTimeTemp, msgTimeHumid, arrTime, tarTemp, '+
        'tempBand, ventilPer, temp1, temp2, temp3, temp4, temp5, temp6, avgTemp, '+
        'humid1, humid2, humid3, humid4, humid5, humid6, avgHumid, fanMode, '+
        'fan1, fan2, fan3, waterMode, water, alarm) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        var sql2 = 'INSERT INTO House2(msgTimeTemp, msgTimeHumid, arrTime, tarTemp, '+
        'tempBand, ventilPer, temp1, temp2, temp3, temp4, temp5, temp6, avgTemp, '+
        'humid1, humid2, humid3, humid4, humid5, humid6, avgHumid, fanMode, '+
        'fan1, fan2, fan3, waterMode, water, alarm) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        var sql = [sql1, sql2];
        for(i=0;i<2;i++){
            var msgTimeTemp = timeConv.convertToTime(dataBean.house[i].msgTimeTemp);
            var msgTimeHumid = timeConv.convertToTime(dataBean.house[i].msgTimeHumid);
            conn.query(sql[i],[
                msgTimeTemp, msgTimeHumid, 
                dataBean.house[i].arrTime, dataBean.house[i].tarTemp, 
                dataBean.house[i].tempBand, dataBean.house[i].ventilPer, 
                dataBean.house[i].temp[0], dataBean.house[i].temp[1], 
                dataBean.house[i].temp[2], dataBean.house[i].temp[3], 
                dataBean.house[i].temp[4], dataBean.house[i].temp[5], dataBean.house[i].avgTemp,
                dataBean.house[i].humid[0], dataBean.house[i].humid[1], 
                dataBean.house[i].humid[2], dataBean.house[i].humid[3], 
                dataBean.house[i].humid[4], dataBean.house[i].humid[5], dataBean.house[i].avgHumid, 
                dataBean.house[i].fanMode, dataBean.house[i].fan[0], 
                dataBean.house[i].fan[1], dataBean.house[i].fan[2],
                dataBean.house[i].waterMode, dataBean.house[i].water, dataBean.house[i].alarm
            ]);
        }
    }catch(err){
        console.log(err);
    }finally{
        if(conn) conn.end();
    }
}

async function selectData(house){
    let conn, result;
    var sql = 'SELECT * FROM '+house+' ORDER BY num DESC LIMIT 1';
    try{
        conn = await pool.getConnection();
        await conn.query('USE farmData');
        result = await conn.query(sql);
        // return result;
        // console.log(result[0].temp1);
    }catch(err){
        console.log(err);
    }finally{
        if(conn) conn.end();
        // console.log('connection ended.');
        console.log(result[0].temp1);
        return result;
    }
    // console.log(result[0].temp1);
}

module.exports = {
    insertData: insertData,
    selectData: selectData
};