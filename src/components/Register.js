import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

function Register() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setFullName('');
    setDob('');
    setUsername('');
    setPassword('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    const fullNameRegex = /^[a-zA-Z\s]+$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!usernameRegex.test(username)) {
      setMessage("❌ Username phải dài 4–20 ký tự.");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setMessage("❌ Password phải ít nhất 6 ký tự, gồm chữ và số.");
      setLoading(false);
      return;
    }

    if (!fullNameRegex.test(fullName)) {
      setMessage("❌ Họ tên chỉ được chứa chữ cái và khoảng trắng.");
      setLoading(false);
      return;
    }

    if (!dobRegex.test(dob)) {
      setMessage("❌ Ngày sinh phải theo định dạng YYYY-MM-DD.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, dob, username, password }),
      });
      
      const data = await res.json();
      
      console.log('Response status:', res.status);
      console.log('Response data:', data);
      
      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        
        // Xóa hết input sau khi đăng ký thành công
        resetForm();
        
        // Delay 2 giây để user đọc thông báo thành công
        setTimeout(() => {
          console.log('Navigating to login...');
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || "❌ Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối. Vui lòng kiểm tra kết nối mạng.");
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrapper: {
      backgroundImage: 'url("./images/poker-img.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: 32,
      borderRadius: 12,
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.4)',
      maxWidth: 420,
      width: '100%',
      color: '#fff',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#e63946',
      textAlign: 'center',
      marginBottom: 24,
    },
    input: {
      width: '90%',
      padding: '12px 15px',
      marginBottom: 16,
      borderRadius: 8,
      border: '2px solid #e63946',
      backgroundColor: '#2c2c2c',
      color: '#eee',
      fontSize: 16,
    },
    button: {
      width: '100%',
      padding: '12px 0',
      borderRadius: 10,
      border: 'none',
      backgroundColor: '#e63946',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
      cursor: 'pointer',
      boxShadow: '0 0 10px #e63946',
      marginTop: 10,
      transition: 'all 0.3s ease',
    },
    buttonDisabled: {
      width: '100%',
      padding: '12px 0',
      borderRadius: 10,
      border: 'none',
      backgroundColor: '#666',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
      cursor: 'not-allowed',
      boxShadow: 'none',
      marginTop: 10,
    },
    message: {
      marginTop: 20,
      fontWeight: '600',
      textAlign: 'center',
      padding: '12px',
      borderRadius: '8px',
    },
    successMessage: {
      color: '#155724',
      backgroundColor: 'rgba(40, 167, 69, 0.2)',
      border: '1px solid #28a745',
    },
    errorMessage: {
      color: '#721c24',
      backgroundColor: 'rgba(220, 53, 69, 0.2)',
      border: '1px solid #dc3545',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? '⏳ Đang đăng ký...' : 'Register'}
          </button>
        </form>
        {message && (
          <p style={{
            ...styles.message,
            ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </p>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#f1faee' }}>Đã có tài khoản? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#e63946',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
