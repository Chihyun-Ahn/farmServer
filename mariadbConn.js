const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'admin',
    password: '1234',
    connectionLimit: 5
});

async function firstTest(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE farmData');
        conn.query('INSERT INTO House1(tarTemp) VALUES(24.0)');

    }catch(err){
        console.log(err);
    }finally{
        if(conn) conn.end();
    }
}

module.exports = {
    firstTest: firstTest
};