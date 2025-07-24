import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const AdminLogin = () => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Test API key bằng cách gọi admin endpoint
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://192.168.20.8:5000'}/api/admin/test-api-key`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Lưu admin session vào localStorage
        localStorage.setItem('adminSession', JSON.stringify({
          apiKey: apiKey,
          user: data.user,
          loginTime: new Date().toISOString(),
          isAdmin: true
        }));

        console.log('✅ Admin login successful:', data);
        navigate('/admin-dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid API key');
      }
    } catch (err) {
      console.error('❌ Admin login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>🔐 Admin Login</h2>
        <p className="admin-note">Enter your Admin API Key to access the admin dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="apiKey">Admin API Key:</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              placeholder="Enter your admin API key"
              autoComplete="off"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Authenticating...' : 'Login as Admin'}
          </button>
        </form>

        <div className="login-links">
          <button 
            onClick={() => navigate('/login')} 
            className="link-button"
          >
            ← Back to User Login
          </button>
        </div>

        <div className="admin-info">
          <h4>ℹ️ Admin Access Information:</h4>
          <ul>
            <li>Admin accounts use API key authentication only</li>
            <li>No username/password login for admin accounts</li>
            <li>Contact system administrator for API key</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
