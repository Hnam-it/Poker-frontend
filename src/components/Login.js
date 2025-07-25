import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include', // Gửi cookie
        });

        if (res.status === 204) {
            throw new Error('Server returned no content');
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Login failed');
        }

        if (!data.token || !data.user) {
            throw new Error('Invalid server response format');
        }

        // Lưu token và user vào localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Chỉ gọi api admin khi user role là admin
        if (data.user.role === 'admin') {
            // Kiểm tra quyền admin, gọi api bảo vệ bằng cookie JWT
            const adminRes = await fetch(`${API_BASE_URL}/api/admin`, {
                credentials: 'include',
            });

            if (!adminRes.ok) {
                throw new Error('Admin access denied or API error');
            }

            const adminData = await adminRes.json();
            console.log('Admin API response:', adminData);

            // Điều hướng đến admin dashboard
            navigate('/admin', { replace: true });
        } else {
            // Điều hướng user thường
            navigate('/profile', { replace: true });
        }

    } catch (error) {
        console.error('Login error:', error);
        setMessage(error.message);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } finally {
        setIsLoading(false);
    }
};


    const styles = {
        wrapper: {
            backgroundImage: 'url("/images/poker-img.jpg")',
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
            opacity: 1,
            transition: 'opacity 0.3s',
        },
        buttonDisabled: {
            opacity: 0.7,
            cursor: 'not-allowed',
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
                <h2 style={styles.title}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isLoading ? styles.buttonDisabled : {})
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <button
                        type="button"
                        style={{
                            ...styles.button,
                            backgroundColor: '#1a1a1a',
                            boxShadow: '0 0 10px #1a1a1a'
                        }}
                        onClick={() => navigate('/register')}
                        disabled={isLoading}
                    >
                        Register
                    </button>
                </form>
                {message && (
                    <p style={{
                        ...styles.message,
                        color: message.includes('failed') ? '#ff6b6b' : '#f1faee'
                    }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;