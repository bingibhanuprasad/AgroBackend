// Model/userModel.js
const db = require('../Config/db');

const createUser = async (name, email, password) => {
  const sql = 'INSERT INTO agrousers (name, email, password) VALUES (?, ?, ?)';
  const [result] = await db.query(sql, [name, email, password]);
  return result;
};

const findUserByEmail = async (email) => {
  const sql = 'SELECT * FROM agrousers WHERE email = ?';
  const [rows] = await db.query(sql, [email]);
  return rows;
};

const getAllUser = async () => {
  const sql = 'SELECT * FROM agrousers';
  const [rows] = await db.query(sql);
  return rows;
};

module.exports = { createUser, findUserByEmail, getAllUser };
