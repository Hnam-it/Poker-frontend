import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
        const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        const fullNameRegex = /^[a-zA-Z\s]+$/;
 // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!usernameRegex.test(username)) {
    setMessage("❌ Username phải dài 4–20 ký tự.");
    return;
  }

  if (!passwordRegex.test(password)) {
    setMessage("❌ Password phải ít nhất 6 ký tự, gồm chữ và số.");
    return;
  }

  if (!fullNameRegex.test(fullName)) {
    setMessage("❌ Họ tên chỉ được chứa chữ cái và khoảng trắng.");
    return;
  }

  

  if (!dobRegex.test(dob)) {
    setMessage("❌ Ngày sinh phải theo định dạng YYYY-MM-DD.");
    return;
  }

    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, dob, username, password }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.status === 201) {
        navigate('/login');
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
    },
    message: {
      marginTop: 20,
      color: '#f1faee',
      fontWeight: '600',
      textAlign: 'center',
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
          <button type="submit" style={styles.button}>Register</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default Register;
