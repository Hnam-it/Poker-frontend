import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

function TestPage() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getTestToken = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/test-token');
      const data = await response.json();
      
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('✅ Token đã được tạo và lưu vào localStorage');
      } else {
        setMessage('❌ Lỗi: ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Lỗi kết nối: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testCreateTable = async () => {
    if (!token) {
      setMessage('❌ Vui lòng lấy token trước');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CREATE_TABLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tableName: 'Test Table',
          gameType: 'texas-holdem',
          maxPlayers: 6,
          smallBlind: 10,
          bigBlind: 20,
          minBuyIn: 1000,
          maxBuyIn: 10000,
          isPrivate: false
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Tạo bàn thành công: ' + JSON.stringify(data.data));
      } else {
        setMessage('❌ Lỗi tạo bàn: ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Lỗi kết nối: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setToken('');
    setMessage('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #14532d 80%, #222 100%)',
      minHeight: '100vh',
      color: '#fff',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#ffd700', marginBottom: '2rem' }}>🧪 Test API Page</h1>
      
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #ffd700',
        maxWidth: '600px'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={getTestToken} 
            disabled={loading}
            style={{
              background: 'linear-gradient(90deg, #ffd700 60%, #14532d 100%)',
              color: '#222',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              marginRight: '1rem'
            }}
          >
            {loading ? '⏳ Loading...' : '🔑 Lấy Test Token'}
          </button>

          <button 
            onClick={testCreateTable} 
            disabled={loading || !token}
            style={{
              background: !token ? 'gray' : 'linear-gradient(90deg, #28a745 60%, #14532d 100%)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: (loading || !token) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              marginRight: '1rem'
            }}
          >
            {loading ? '⏳ Loading...' : '🎲 Test Tạo Bàn'}
          </button>

          <button 
            onClick={clearData}
            style={{
              background: '#dc3545',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            🗑️ Clear Data
          </button>
        </div>

        {token && (
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#ffd700' }}>Token:</strong>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '0.5rem',
              borderRadius: '4px',
              wordBreak: 'break-all',
              fontSize: '0.8rem',
              marginTop: '0.5rem'
            }}>
              {token}
            </div>
          </div>
        )}

        {message && (
          <div style={{
            background: message.includes('✅') ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: `1px solid ${message.includes('✅') ? '#00ff00' : '#ff0000'}`,
            whiteSpace: 'pre-wrap'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestPage;
