import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [topupAmount, setTopupAmount] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // Load user info từ localStorage hoặc fetch từ API
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);
    fetchHistory(storedUser.token);
  }, [navigate]);

  // Lấy lịch sử cược
  async function fetchHistory(token) {
    try {
      const res = await fetch('http://localhost:3001/api/user/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(data.history || []);
      } else {
        setMessage(data.message || 'Failed to fetch history');
      }
    } catch (err) {
      setMessage('Error fetching history');
    }
  }

  // Xử lý nạp tiền
  async function handleTopup(e) {
    e.preventDefault();
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/user/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      setMessage(data.message || 'Nạp tiền thành công');
      if (res.ok) {
        setUser((prev) => ({ ...prev, balance: (prev.balance || 0) + amount }));
        localStorage.setItem('user', JSON.stringify({ ...user, balance: (user.balance || 0) + amount, token: user.token }));
        setTopupAmount('');
      }
    } catch (err) {
      setMessage('Lỗi khi nạp tiền');
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  if (!user) return null;

  return (
    <div style={{
      background: 'url("/images/poker-bg.jpg") center/cover no-repeat',
      minHeight: '100vh',
      color: '#f4f1de',
      fontFamily: "'Roboto Slab', serif",
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h1 style={{ fontSize: '3rem', color: '#e63946', marginBottom: '1rem' }}>Welcome, {user.fullName}</h1>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 0 20px #e63946',
        marginBottom: '2rem',
      }}>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Balance:</strong> ${user.balance?.toFixed(2) || '0.00'}</p>
      </div>

      <form onSubmit={handleTopup} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%',
        maxWidth: '450px',
        marginBottom: '1.5rem',
      }}>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter amount to top up"
          value={topupAmount}
          onChange={(e) => setTopupAmount(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #e63946',
            backgroundColor: '#2c2c2c',
            color: '#eee',
            fontSize: '16px',
            outline: 'none',
          }}
        />
        <button type="submit" style={{
          backgroundColor: '#e63946',
          color: '#fff',
          fontWeight: 'bold',
          padding: '12px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 0 10px #e63946',
          fontSize: '18px',
        }}>
          Top Up
        </button>
      </form>
      {message && <p style={{ color: '#f1faee', fontWeight: '600', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}

      <div style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '12px',
        padding: '1rem',
        maxWidth: '450px',
        width: '100%',
        color: '#a8dadc',
        maxHeight: '200px',
        overflowY: 'auto',
        marginBottom: '2rem',
      }}>
        <h3 style={{ color: '#f1faee', marginBottom: '0.5rem' }}>History</h3>
        {history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {history.map((item, i) => (
              <li key={i} style={{ borderBottom: '1px solid #e63946', padding: '0.5rem 0' }}>
                <strong>{item.date}</strong>: {item.description} - ${item.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => navigate('/lobby')}
        style={{
          backgroundColor: '#1d3557',
          color: '#f1faee',
          padding: '12px 20px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '18px',
          marginBottom: '1rem',
          boxShadow: '0 0 8px #1d3557',
        }}
      >
        Go to Lobby
      </button>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#e63946',
          color: '#f1faee',
          padding: '12px 20px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '18px',
          boxShadow: '0 0 10px #e63946',
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
