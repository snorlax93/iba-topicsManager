const mariadb = require('mariadb');
const config = require("../configs/db");
const dbConfig = config.config.db;

const pool = mariadb.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    connectionLimit: dbConfig.connectionLimit,
    port: dbConfig.port
});

module.exports = { pool };

// async function asyncFunction() {
//     let conn;
//     try {
//         conn = await pool.getConnection();
//         const rows = await conn.query("SELECT 1 as val");
//         console.log(rows); //[ {val: 1}, meta: ... ]
//         const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
//         console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

//     } catch (err) {
//         throw err;
//     } finally {
//         if (conn) return conn.end();
//     }
// }