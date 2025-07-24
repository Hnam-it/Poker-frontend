import React, { useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

function TestLogin() {
  const [users, setUsers] = useState([]);
  const [loginResult, setLoginResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tạo user test
  const createTestUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/create-test-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Tạo test users thành công!');
        fetchUsers();
      } else {
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      alert('❌ Lỗi kết nối: ' + err.message);
    }
    setLoading(false);
  };

  // Lấy danh sách user
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/test-users`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Đăng nhập nhanh
  const quickLogin = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/quick-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoginResult(data);
        alert('✅ Đăng nhập thành công!');
      } else {
        alert('❌ Lỗi đăng nhập: ' + data.message);
      }
    } catch (err) {
      alert('❌ Lỗi kết nối: ' + err.message);
    }
    setLoading(false);
  };

  // Đăng nhập thông thường
  const normalLogin = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoginResult(data);
        alert('✅ Đăng nhập thành công!');
      } else {
        alert('❌ Lỗi đăng nhập: ' + data.message);
      }
    } catch (err) {
      alert('❌ Lỗi kết nối: ' + err.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{
      background: '#1a1a1a',
      color: '#fff',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '800px',
      margin: '20px auto'
    }}>
      <h2 style={{ color: '#ffd700', textAlign: 'center' }}>🧪 Test Login API</h2>
      
      {/* Nút tạo test users */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button 
          onClick={createTestUsers}
          disabled={loading}
          style={{
            background: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Đang tạo...' : '🔧 Tạo Test Users'}
        </button>
      </div>

      {/* Danh sách users */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#ffd700' }}>👥 Danh sách Users ({users.length})</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '15px'
        }}>
          {users.map((user, idx) => (
            <div key={idx} style={{
              background: '#333',
              padding: '15px',
              borderRadius: '8px',
              border: user.role === 'admin' ? '2px solid #ffd700' : '1px solid #555'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: user.role === 'admin' ? '#ffd700' : '#fff' }}>
                  {user.fullName}
                </strong>
                <span style={{ 
                  background: user.role === 'admin' ? '#ffd700' : '#007bff',
                  color: user.role === 'admin' ? '#000' : '#fff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginLeft: '10px'
                }}>
                  {user.role}
                </span>
              </div>
              <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>
                Username: {user.username}<br/>
                Chips: {user.chips?.toLocaleString() || 0}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => quickLogin(user.username)}
                  disabled={loading}
                  style={{
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🚀 Quick Login
                </button>
                <button
                  onClick={() => normalLogin(user.username, '123456')}
                  disabled={loading}
                  style={{
                    background: '#6f42c1',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔐 Normal Login
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kết quả đăng nhập */}
      {loginResult && (
        <div style={{
          background: '#004d00',
          border: '1px solid #00ff00',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h4 style={{ color: '#00ff00', margin: '0 0 10px 0' }}>✅ Đăng nhập thành công!</h4>
          <pre style={{ 
            background: '#222', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(loginResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Hướng dẫn */}
      <div style={{
        background: '#333',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '20px',
        fontSize: '14px'
      }}>
        <h4 style={{ color: '#ffd700' }}>📋 Hướng dẫn test:</h4>
        <ol style={{ color: '#ccc' }}>
          <li>Nhấn "Tạo Test Users" để tạo dữ liệu mẫu</li>
          <li>Dùng "Quick Login" để đăng nhập nhanh không cần password</li>
          <li>Dùng "Normal Login" để test API login thông thường (password: 123456)</li>
          <li>Kiểm tra Local Storage và token sau khi đăng nhập</li>
        </ol>
        <p style={{ color: '#ffd700', fontSize: '12px' }}>
          💡 Tất cả user test đều có password: <strong>123456</strong>
        </p>
      </div>
    </div>
  );
}

export default TestLogin;
