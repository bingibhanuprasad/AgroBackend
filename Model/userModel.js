const db = require('../Config/db')

const createUser = (name, email, password, callback) => {
  const sql = 'INSERT INTO agrousers (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], callback);
};

const findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM agrousers WHERE email = ?';
  db.query(sql, [email], callback);
};

module.exports = { createUser, findUserByEmail };
