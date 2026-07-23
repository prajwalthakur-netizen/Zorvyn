const db = require('../config/db');

const getRecords = (req, res) => {
  const { category, type, date, page = 1, limit = 10 } = req.query;

  let query = 'SELECT * FROM records WHERE 1=1';
  const params = [];

  if (category) { query += ' AND category = ?'; params.push(category); }
  if (type)     { query += ' AND type = ?';     params.push(type); }
  if (date)     { query += ' AND date = ?';     params.push(date); }

  query += ' ORDER BY created_at DESC';

  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const records = db.prepare(query).all(...params);
  const total = db.prepare('SELECT COUNT(*) as count FROM records').get();

  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    totalRecords: total.count,
    totalPages: Math.ceil(total.count / parseInt(limit)),
    records
  });
};

const getRecordById = (req, res) => {
  const record = db.prepare('SELECT * FROM records WHERE id = ?').get(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });
  res.json(record);
};

const createRecord = (req, res) => {
  const { title, amount, category, type, date, notes } = req.body;

  if (!title || !amount || !category || !type || !date)
    return res.status(400).json({ message: 'All fields are required' });

  if (!['income', 'expense'].includes(type))
    return res.status(400).json({ message: 'Type must be income or expense' });

  const stmt = db.prepare(
    'INSERT INTO records (title, amount, category, type, date, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(title, amount, category, type, date, notes || '', req.user.id);
  res.status(201).json({ message: 'Record created', recordId: result.lastInsertRowid });
};

const updateRecord = (req, res) => {
  const { title, amount, category, type, date, notes } = req.body;

  const record = db.prepare('SELECT * FROM records WHERE id = ?').get(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });

  db.prepare(
    'UPDATE records SET title=?, amount=?, category=?, type=?, date=?, notes=? WHERE id=?'
  ).run(
    title || record.title,
    amount || record.amount,
    category || record.category,
    type || record.type,
    date || record.date,
    notes || record.notes,
    req.params.id
  );

  res.json({ message: 'Record updated' });
};

const deleteRecord = (req, res) => {
  const record = db.prepare('SELECT * FROM records WHERE id = ?').get(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });

  db.prepare('DELETE FROM records WHERE id = ?').run(req.params.id);
  res.json({ message: 'Record deleted' });
};

module.exports = { getRecords, getRecordById, createRecord, updateRecord, deleteRecord };