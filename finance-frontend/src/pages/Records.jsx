import { useEffect, useState } from 'react';
import { getRecords, createRecord, updateRecord, deleteRecord } from '../services/api';
import { useAuth } from '../context/AuthContext';

const empty = { title: '', amount: '', category: '', type: 'expense', date: '', notes: '' };

export default function Records() {
  const [records, setRecords]   = useState([]);
  const [form, setForm]         = useState(empty);
  const [editing, setEditing]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState({ category: '', type: '' });
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const fetchRecords = () => {
    getRecords(filter)
      .then(res => setRecords(res.data.records))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line
useEffect(() => { fetchRecords(); }, [filter]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateRecord(editing, form);
      } else {
        await createRecord(form);
      }
      setForm(empty);
      setEditing(null);
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (record) => {
    setForm(record);
    setEditing(record.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    await deleteRecord(id);
    fetchRecords();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Financial Records</h2>
        {isAdmin && (
          <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditing(null); }}>
            {showForm ? 'Cancel' : '+ Add Record'}
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <select style={styles.filterInput} value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          style={styles.filterInput}
          placeholder="Filter by category..."
          value={filter.category}
          onChange={e => setFilter({...filter, category: e.target.value})}
        />
        <button style={styles.clearBtn} onClick={() => setFilter({ category: '', type: '' })}>
          Clear
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && isAdmin && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>{editing ? 'Edit Record' : 'Add New Record'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input style={styles.input} name="title"    placeholder="Title"    value={form.title}    onChange={handleChange} required />
            <input style={styles.input} name="amount"   placeholder="Amount"   value={form.amount}   onChange={handleChange} type="number" required />
            <input style={styles.input} name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <select style={styles.input} name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input style={styles.input} name="date"  type="date" value={form.date}  onChange={handleChange} required />
            <input style={styles.input} name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} />
            <button style={styles.submitBtn} type="submit">
              {editing ? 'Update Record' : 'Add Record'}
            </button>
          </form>
        </div>
      )}

      {/* Records Table */}
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <div style={styles.table}>
          <table style={styles.tableEl}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Notes</th>
                {isAdmin && <th style={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan="7" style={styles.empty}>No records found</td></tr>
              )}
              {records.map(r => (
                <tr key={r.id} style={styles.tr}>
                  <td style={styles.td}>{r.title}</td>
                  <td style={styles.td}>₹{r.amount?.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: r.type === 'income' ? '#dcfce7' : '#fee2e2',
                      color: r.type === 'income' ? '#16a34a' : '#dc2626',
                    }}>{r.type}</span>
                  </td>
                  <td style={styles.td}>{r.category}</td>
                  <td style={styles.td}>{r.date}</td>
                  <td style={styles.td}>{r.notes}</td>
                  {isAdmin && (
                    <td style={styles.td}>
                      <button style={styles.editBtn}   onClick={() => handleEdit(r)}>Edit</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(r.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container:   { padding: '32px', maxWidth: '1200px', margin: '0 auto' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading:     { fontSize: '28px', color: '#1a1a2e' },
  addBtn:      { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  filterBar:   { display: 'flex', gap: '12px', marginBottom: '24px' },
  filterInput: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  clearBtn:    { padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: '#fff' },
  formCard:    { background: '#fff', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  formTitle:   { marginBottom: '16px', color: '#1a1a2e' },
  form:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  input:       { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  submitBtn:   { gridColumn: '1 / -1', padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  loading:     { padding: '40px', textAlign: 'center' },
  table:       { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  tableEl:     { width: '100%', borderCollapse: 'collapse' },
  thead:       { background: '#f8fafc' },
  th:          { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' },
  tr:          { borderTop: '1px solid #f1f5f9' },
  td:          { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge:       { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty:       { padding: '24px', textAlign: 'center', color: '#999' },
  editBtn:     { background: '#dbeafe', color: '#2563eb', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontWeight: '600' },
  deleteBtn:   { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
};