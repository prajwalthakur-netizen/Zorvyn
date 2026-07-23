import { useEffect, useState } from 'react';
import { getSummary, getTrends } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#667eea', '#eb3349', '#11998e', '#f7971e', '#764ba2', '#38ef7d'];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [trends,  setTrends]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSummary(), getTrends()])
      .then(([s, t]) => {
        setSummary(s.data);
        setTrends(t.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  // Prepare pie chart data
  const pieData = summary?.byCategory?.map(c => ({
    name: `${c.category} (${c.type})`,
    value: c.total
  }));

  // Prepare bar chart data
  const monthlyMap = {};
  trends?.monthly?.forEach(m => {
    if (!monthlyMap[m.month]) monthlyMap[m.month] = { month: m.month };
    monthlyMap[m.month][m.type] = m.total;
  });
  const barData = Object.values(monthlyMap);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Analytics & Trends 📊</h2>
      <p style={styles.sub}>Visual breakdown of your finances</p>

      {/* Summary Cards */}
      <div style={styles.cards}>
        <div style={{...styles.card, background: 'linear-gradient(135deg, #11998e, #38ef7d)'}}>
          <p style={styles.cardLabel}>Total Income</p>
          <h3 style={styles.cardValue}>₹{summary?.totalIncome?.toLocaleString()}</h3>
        </div>
        <div style={{...styles.card, background: 'linear-gradient(135deg, #eb3349, #f45c43)'}}>
          <p style={styles.cardLabel}>Total Expense</p>
          <h3 style={styles.cardValue}>₹{summary?.totalExpense?.toLocaleString()}</h3>
        </div>
        <div style={{...styles.card, background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
          <p style={styles.cardLabel}>Net Balance</p>
          <h3 style={styles.cardValue}>₹{summary?.netBalance?.toLocaleString()}</h3>
        </div>
      </div>

      {/* Bar Chart - Monthly Trends */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income"  fill="#11998e" radius={[4,4,0,0]} />
            <Bar dataKey="expense" fill="#eb3349" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Category Breakdown */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Category Breakdown</h3>
        {pieData?.length === 0 ? (
          <p style={styles.empty}>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ₹${value}`}
              >
                {pieData?.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Weekly Trends Table */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Weekly Breakdown</h3>
        <table style={styles.tableEl}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Week</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {trends?.weekly?.length === 0 && (
              <tr><td colSpan="3" style={styles.empty}>No data</td></tr>
            )}
            {trends?.weekly?.map((w, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>{w.week}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: w.type === 'income' ? '#dcfce7' : '#fee2e2',
                    color: w.type === 'income' ? '#16a34a' : '#dc2626',
                  }}>{w.type}</span>
                </td>
                <td style={styles.td}>₹{w.total?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container:  { padding: '32px', maxWidth: '1200px', margin: '0 auto' },
  heading:    { fontSize: '28px', color: '#1a1a2e', marginBottom: '4px' },
  sub:        { color: '#666', marginBottom: '32px' },
  loading:    { padding: '40px', textAlign: 'center', fontSize: '18px' },
  cards:      { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  card:       { padding: '24px', borderRadius: '16px', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  cardLabel:  { fontSize: '14px', opacity: 0.9, marginBottom: '8px' },
  cardValue:  { fontSize: '28px', fontWeight: '700', margin: 0 },
  chartCard:  { background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  chartTitle: { fontSize: '18px', color: '#1a1a2e', marginBottom: '20px' },
  tableEl:    { width: '100%', borderCollapse: 'collapse' },
  thead:      { background: '#f8fafc' },
  th:         { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' },
  tr:         { borderTop: '1px solid #f1f5f9' },
  td:         { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge:      { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty:      { padding: '24px', textAlign: 'center', color: '#999' },
};