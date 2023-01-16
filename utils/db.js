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