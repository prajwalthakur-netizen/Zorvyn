import { useEffect, useState } from 'react';
import { getSummary } from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getSummary()
      .then(res => setSummary(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome back! 👋</h2>
      <p style={styles.sub}>Here's your financial overview</p>

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
        <div style={{...styles.card, background: 'linear-gradient(135deg, #f7971e, #ffd200)'}}>
          <p style={styles.cardLabel}>Total Records</p>
          <h3 style={styles.cardValue}>{summary?.totalRecords}</h3>
        </div>
      </div>

      <h3 style={styles.sectionTitle}>Recent Activity</h3>
      <div style={styles.table}>
        <table style={styles.tableEl}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {summary?.recentActivity?.length === 0 && (
              <tr><td colSpan="5" style={styles.empty}>No records yet</td></tr>
            )}
            {summary?.recentActivity?.map(r => (
              <tr key={r.id} style={styles.tr}>
                <td style={styles.td}>{r.title}</td>
                <td style={styles.td}>₹{r.amount?.toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: r.type === 'income' ? '#dcfce7' : '#fee2e2',
                    color: r.type === 'income' ? '#16a34a' : '#dc2626',
                  }}>
                    {r.type}
                  </span>
                </td>
                <td style={styles.td}>{r.category}</td>
                <td style={styles.td}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '32px', maxWidth: '1200px', margin: '0 auto' },
  heading: { fontSize: '28px', color: '#1a1a2e', marginBottom: '4px' },
  sub: { color: '#666', marginBottom: '32px' },
  loading: { padding: '40px', textAlign: 'center', fontSize: '18px' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' },
  card: { padding: '24px', borderRadius: '16px', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  cardLabel: { fontSize: '14px', opacity: 0.9, marginBottom: '8px' },
  cardValue: { fontSize: '28px', fontWeight: '700', margin: 0 },
  sectionTitle: { fontSize: '20px', color: '#1a1a2e', marginBottom: '16px' },
  table: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  tableEl: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' },
  tr: { borderTop: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty: { padding: '24px', textAlign: 'center', color: '#999' },
};