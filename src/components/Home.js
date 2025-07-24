import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #222 80%, #14532d 100%)',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: "'Cinzel', 'Roboto Slab', serif",
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        background: 'rgba(0,0,0,0.8)',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 0 30px rgba(255,215,0,0.3)',
        border: '2px solid rgba(255,215,0,0.5)'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          color: '#ffd700', 
          marginBottom: '1rem',
          textShadow: '0 2px 8px #000a'
        }}>
          🃏 Poker Online
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#a8dadc', 
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          Chào mừng đến với sảnh chơi poker trực tuyến! 
          Tham gia các bàn chơi Texas Hold'em và Omaha với người chơi từ khắp nơi.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(90deg, #ffd700 60%, #14532d 100%)',
              color: '#222',
              padding: '15px 30px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px',
              boxShadow: '0 0 15px #ffd700',
              transition: 'all 0.3s ease'
            }}
          >
            🎯 Đăng ký ngay
          </button>
          
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(90deg, #1d3557 60%, #14532d 100%)',
              color: '#fff',
              padding: '15px 30px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px',
              boxShadow: '0 0 15px #1d3557',
              transition: 'all 0.3s ease'
            }}
          >
            🔐 Đăng nhập
          </button>
        </div>

        <button
          onClick={() => navigate('/lobby')}
          style={{
            background: 'linear-gradient(90deg, #e63946 60%, #14532d 100%)',
            color: '#fff',
            padding: '12px 25px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 0 10px #e63946',
            marginTop: '1rem'
          }}
        >
          🎲 Vào sảnh chơi
        </button>

        <div style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: '#666',
          borderTop: '1px solid #444',
          paddingTop: '1rem'
        }}>
          <p>🎮 Chơi Texas Hold'em • Omaha • Tournament</p>
          <p>💰 Chip miễn phí • Bàn chơi 24/7 • Chat real-time</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
