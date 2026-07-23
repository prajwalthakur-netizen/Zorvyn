import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>💰 Finance Manager</div>
      <div style={styles.links}>
        <Link to="/"          style={styles.link}>Dashboard</Link>
        <Link to="/records"   style={styles.link}>Records</Link>
        {user?.role !== 'viewer' && (
          <Link to="/analytics" style={styles.link}>Analytics</Link>
        )}
      </div>
      <div style={styles.right}>
        <span style={styles.role}>{user?.role?.toUpperCase()}</span>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '64px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
  },
  links: {
    display: 'flex',
    gap: '24px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    opacity: 0.9,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  role: {
    background: 'rgba(255,255,255,0.2)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  logout: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
};