const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../Model/userModel');
require('dotenv').config();

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    if (results.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    createUser(name, email, hashedPassword, (err) => {
      if (err) return res.status(500).json({ error: 'Signup Failed' });
      res.status(201).json({ message: 'User Registered Successfully' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ message: 'Login successful', token });
  });
};
