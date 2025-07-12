const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, getAllUser } = require('../Model/userModel');
require('dotenv').config();

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser.length > 0)
      return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10); // 🔐 Hashing the password
    await createUser(name, email, hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const users = await findUserByEmail(email);
    if (users.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_jwt_secret', // fallback for safety
      { expiresIn: '1d' }
    );

    // 🔐 Temporary admin role check based on email only
    let role = (user.email === "bhanuprasdbingi@gmail.com") ? "admin" : "user";

    res.json({
      message: 'Login successful',
    
      token,
      user: { id: user.id, name: user.name, email: user.email, role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUser();
    res.status(200).json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
