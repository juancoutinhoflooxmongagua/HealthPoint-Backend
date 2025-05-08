const mysql = require('mysql2/promise');
require('dotenv').config();

const dbUrl = new URL(process.env.MYSQL_URL); 

const pool = mysql.createPool({
  host: dbUrl.hostname,           
  port: dbUrl.port || 3306,       
  user: dbUrl.username,       
  password: dbUrl.password,       
  database: dbUrl.pathname.slice(1), 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
