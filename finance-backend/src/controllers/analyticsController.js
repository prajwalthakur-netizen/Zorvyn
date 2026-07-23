const db = require('../config/db');

const getSummary = (req, res) => {
  const totalIncome = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM records WHERE type = 'income'"
  ).get();

  const totalExpense = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM records WHERE type = 'expense'"
  ).get();

  const byCategory = db.prepare(
    "SELECT category, type, SUM(amount) as total FROM records GROUP BY category, type"
  ).all();

  const totalRecords = db.prepare("SELECT COUNT(*) as count FROM records").get();

  const recentActivity = db.prepare(
    "SELECT * FROM records ORDER BY created_at DESC LIMIT 5"
  ).all();

  res.json({
    totalIncome: totalIncome.total,
    totalExpense: totalExpense.total,
    netBalance: totalIncome.total - totalExpense.total,
    totalRecords: totalRecords.count,
    byCategory,
    recentActivity
  });
};


const getTrends = (req, res) => {
  const monthly = db.prepare(`
    SELECT 
      strftime('%Y-%m', date) as month,
      type,
      SUM(amount) as total
    FROM records
    GROUP BY month, type
    ORDER BY month DESC
  `).all();

  const weekly = db.prepare(`
    SELECT 
      strftime('%Y-W%W', date) as week,
      type,
      SUM(amount) as total
    FROM records
    GROUP BY week, type
    ORDER BY week DESC
  `).all();

  res.json({ monthly, weekly });
};

module.exports = { getSummary, getTrends };