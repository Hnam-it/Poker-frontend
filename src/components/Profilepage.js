import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

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
      const res = await fetch(`${API_BASE_URL}/api/user/history`, {
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
      const res = await fetch(`${API_BASE_URL}/api/user/topup`, {
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
      background: 'linear-gradient(135deg, #14532d 80%, #222 100%)',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: "'Cinzel', 'Roboto Slab', serif",
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        borderRadius: '18px',
        boxShadow: '0 0 30px 5px #000a, 0 0 0 8px #14532d inset',
        maxWidth: 500,
        width: '100%',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '2.5rem', color: '#ffd700', marginBottom: '1rem', fontFamily: 'Cinzel, serif', textShadow: '0 2px 8px #000a' }}>
          🃏 {user.fullName}
        </h1>
        <p style={{ fontSize: 20, marginBottom: 8 }}><strong>Username:</strong> <span style={{ color: '#a8dadc' }}>{user.username}</span></p>
        <p style={{ fontSize: 20 }}><strong>Balance:</strong> <span style={{ color: '#ffd700' }}>${user.balance?.toFixed(2) || '0.00'}</span></p>
      </div>

      <form onSubmit={handleTopup} style={{
        background: 'rgba(0,0,0,0.8)',
        borderRadius: 14,
        boxShadow: '0 0 10px #ffd700',
        padding: '1.5rem',
        maxWidth: 400,
        width: '100%',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <label style={{ color: '#ffd700', fontWeight: 'bold', fontSize: 18 }}>Nạp tiền vào tài khoản</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Nhập số tiền muốn nạp"
          value={topupAmount}
          onChange={(e) => setTopupAmount(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #ffd700',
            backgroundColor: '#1a3a24',
            color: '#fff',
            fontSize: '18px',
            outline: 'none',
            boxShadow: '0 2px 8px #0004',
          }}
        />
        <button type="submit" style={{
          background: 'linear-gradient(90deg, #ffd700 60%, #e63946 100%)',
          color: '#14532d',
          fontWeight: 'bold',
          padding: '12px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 0 10px #ffd700',
        }}>
          Nạp tiền
        </button>
      </form>
      {message && <p style={{ color: '#ffd700', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}

      <div style={{
        background: 'rgba(0,0,0,0.8)',
        borderRadius: 14,
        boxShadow: '0 0 10px #a8dadc',
        padding: '1.5rem',
        maxWidth: 400,
        width: '100%',
        color: '#a8dadc',
        maxHeight: '220px',
        overflowY: 'auto',
        marginBottom: '2rem',
      }}>
        <h3 style={{ color: '#ffd700', marginBottom: '0.5rem', fontWeight: 'bold' }}>Lịch sử giao dịch</h3>
        {history.length === 0 ? (
          <p style={{ color: '#aaa' }}>Chưa có lịch sử giao dịch.</p>
        ) : (
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {history.map((item, i) => (
              <li key={i} style={{ borderBottom: '1px solid #ffd700', padding: '0.5rem 0' }}>
                <strong>{item.date}</strong>: {item.description} - <span style={{ color: '#ffd700' }}>${item.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => navigate('/lobby')}
          style={{
            background: 'linear-gradient(90deg, #1d3557 60%, #14532d 100%)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 0 8px #1d3557',
          }}
        >
          Vào sảnh chơi
        </button>
        <button
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(90deg, #e63946 60%, #ffd700 100%)',
            color: '#222',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 0 10px #e63946',
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Profile;
