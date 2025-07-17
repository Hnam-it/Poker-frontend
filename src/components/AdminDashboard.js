import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        credentials: 'include', // Important to send cookie
      });

      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>👑 Admin Dashboard</h1>
      <p style={styles.text}>Welcome, <strong>{user?.fullName || 'Admin'}</strong></p>
      <p style={styles.text}>Role: {user?.role}</p>

      <div style={styles.box}>
        <h3>📊 User Stats (Dummy)</h3>
        <ul>
          <li>✔ Total users: 123</li>
          <li>✔ Regular users: 120</li>
          <li>✔ Admins: 3</li>
        </ul>
      </div>

      <button onClick={handleLogout} style={styles.button}>Logout</button>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#fff',
    padding: '40px',
    borderRadius: '12px',
    maxWidth: '600px',
    margin: '50px auto',
    textAlign: 'center',
    boxShadow: '0 0 20px rgba(255, 0, 0, 0.4)',
  },
  header: {
    fontSize: '32px',
    color: '#e63946',
    marginBottom: '20px',
  },
  text: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  box: {
    backgroundColor: '#1e1e1e',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
    textAlign: 'left',
  },
  button: {
    marginTop: '30px',
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};

export default AdminDashboard;
