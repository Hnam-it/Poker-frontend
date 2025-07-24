import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTable() {
  const [formData, setFormData] = useState({
    tableName: '',
    gameType: 'texas-holdem',
    maxPlayers: 6,
    smallBlind: 10,
    bigBlind: 20,
    minBuyIn: 1000,
    maxBuyIn: 10000,
    isPrivate: false,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Kiểm tra login status
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
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
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          padding: '3rem',
          borderRadius: '12px',
          border: '1px solid #ffd700',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>🔒 Cần đăng nhập</h2>
          <p style={{ marginBottom: '2rem', color: '#a8dadc' }}>
            Bạn cần đăng nhập để tạo bàn chơi mới
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(90deg, #ffd700 60%, #14532d 100%)',
                color: '#222',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 0 10px #ffd700'
              }}
            >
              🔑 Đăng nhập
            </button>
            <button
              onClick={() => navigate('/lobby')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #555',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              ⬅️ Quay lại lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Bạn cần đăng nhập để tạo bàn chơi');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/game/create-table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        navigate('/lobby');
      } else {
        setError(data.message || 'Lỗi khi tạo bàn chơi');
      }
    } catch (err) {
      console.error('Error creating table:', err);
      if (err.message.includes('401') || err.message.includes('token')) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        setError(`Không thể kết nối đến server: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
      <h1 style={{ 
        fontSize: '2.5rem', 
        color: '#ffd700', 
        marginBottom: '2rem', 
        fontFamily: 'Cinzel, serif', 
        textShadow: '0 2px 8px #000a' 
      }}>
        🎲 Tạo bàn chơi mới
      </h1>

      <form onSubmit={handleSubmit} style={{
        background: 'rgba(0,0,0,0.8)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #ffd700',
        maxWidth: '500px',
        width: '100%'
      }}>
        {error && (
          <div style={{
            background: 'rgba(255,0,0,0.2)',
            color: '#ff6b6b',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ff6b6b',
            marginBottom: '1rem'
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>
            Tên bàn chơi:
          </label>
          <input
            type="text"
            name="tableName"
            value={formData.tableName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #555',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>
            Loại game:
          </label>
          <select
            name="gameType"
            value={formData.gameType}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #555',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            <option value="texas-holdem">Texas Hold'em</option>
            <option value="omaha">Omaha</option>
            <option value="seven-card-stud">Seven Card Stud</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>
              Số người tối đa:
            </label>
            <input
              type="number"
              name="maxPlayers"
              value={formData.maxPlayers}
              onChange={handleChange}
              min="2"
              max="10"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #555',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>
              Small Blind:
            </label>
            <input
              type="number"
              name="smallBlind"
              value={formData.smallBlind}
              onChange={handleChange}
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #555',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>
              Big Blind:
            </label>
            <input
              type="number"
              name="bigBlind"
              value={formData.bigBlind}
              onChange={handleChange}
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #555',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>
              Buy-in tối thiểu:
            </label>
            <input
              type="number"
              name="minBuyIn"
              value={formData.minBuyIn}
              onChange={handleChange}
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #555',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>
              Buy-in tối đa:
            </label>
            <input
              type="number"
              name="maxBuyIn"
              value={formData.maxBuyIn}
              onChange={handleChange}
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #555',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', color: '#ffd700' }}>
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            Bàn riêng tư
          </label>
        </div>

        {formData.isPrivate && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>
              Mật khẩu:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #555',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/lobby')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #555',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ⬅️ Quay lại
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(255,215,0,0.5)' : 'linear-gradient(90deg, #ffd700 60%, #14532d 100%)',
              color: '#222',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 0 10px #ffd700'
            }}
          >
            {loading ? '⏳ Đang tạo...' : '✅ Tạo bàn chơi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTable;
