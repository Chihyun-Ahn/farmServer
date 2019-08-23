const mariadb = require('mariadb');
const timeConv = require('./timeConvert');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'admin',
    password: '1234',
    connectionLimit: 5
});

async function insertData(farmInfo){
    let conn;

    try{
        var house1 = {t1:0, t2:0, h1:0, h2:0, houseTime:"no data"};
        var house2 = {t1:0, t2:0, h1:0, h2:0, houseTime:"no data"};
        var house = [house1, house2];

        for(i=0;i<2;i++){
            house[i].t1   = farmInfo[i].temperature1;
            house[i].t2   = farmInfo[i].temperature2;
            house[i].h1   = farmInfo[i].humidity1;
            house[i].h2   = farmInfo[i].humidity2;
            house[i].houseTime   = timeConv.convertToTime(farmInfo[i].sigTime)
        }

        conn = await pool.getConnection();
        conn.query('USE farmData');
        conn.query('INSERT INTO House1(temp1, temp2, humid1, humid2, msgTime) VALUES(?,?,?,?,?)',[house[0].t1,house[0].t2,house[0].h1,house[0].h2,house[0].houseTime]);
        conn.query('INSERT INTO House2(temp1, temp2, humid1, humid2, msgTime) VALUES(?,?,?,?,?)',[house[1].t1,house[1].t2,house[1].h1,house[1].h2,house[1].houseTime]);
    }catch(err){
        console.log(err);
    }finally{
        if(conn) conn.end();
    }
}

async function selectData(param, house){
    let conn, result;
    var sql = 'SELECT '+param+' FROM '+house+' ORDER BY num LIMIT 1';
    try{
        conn = await pool.getConnection();
        await conn.query('USE farmData');
        result = await conn.query(sql);
        // console.log(result[0].temp1);
    }catch(err){
        console.log(err);
    }finally{
        if(conn) conn.end();
        // console.log('connection ended.');
        // return result;
    }
    // console.log(result[0].temp1);
    return result[0].temp1;
}

module.exports = {
    insertData: insertData,
    selectData: selectData
};