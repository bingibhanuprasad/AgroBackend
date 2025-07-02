const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10, // Limit number of simultaneous connections
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
  } else {
    console.log('✅ MySQL connected using connection pool');
    connection.release(); // Release connection back to the pool
  }
});

module.exports = pool.promise(); // Use promise-based pool
