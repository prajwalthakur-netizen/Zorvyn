const db = require('../config/db');

// GET /api/users — admin only
const getUsers = (req, res) => {
  const users = db.prepare(
    'SELECT id, name, email, role, status, created_at FROM users'
  ).all();
  res.json(users);
};

// PATCH /api/users/:id — admin only (update role and/or status)
const updateUser = (req, res) => {
  const { role, status } = req.body;
  const allowedRoles = ['viewer', 'analyst', 'admin'];
  const allowedStatus = ['active', 'inactive'];

  if (role && !allowedRoles.includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  if (status && !allowedStatus.includes(status))
    return res.status(400).json({ message: 'Invalid status. Use active or inactive' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  db.prepare('UPDATE users SET role = ?, status = ? WHERE id = ?').run(
    role || user.role,
    status || user.status,
    req.params.id
  );

  res.json({ message: 'User updated successfully' });
};

module.exports = { getUsers, updateUser };