const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
const register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const allowedRoles = ['viewer', 'analyst', 'admin'];
  const userRole = allowedRoles.includes(role) ? role : 'viewer';

  try {
    const stmt = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, email, hashedPassword, userRole);
    res.status(201).json({ message: 'User registered', userId: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
};

// POST /api/auth/login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ message: 'Login successful', token, role: user.role });
};

module.exports = { register, login };