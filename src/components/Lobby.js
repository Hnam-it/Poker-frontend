import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

function Lobby() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy danh sách phòng chơi từ API
    const fetchLobbyData = async () => {
      try {
        setLoading(true);
        
        // Gọi API lobby
        const lobbyResponse = await fetch(`${API_BASE_URL}/api/game/lobby`);
        const lobbyData = await lobbyResponse.json();
        
        if (lobbyData.success) {
          setTables(lobbyData.data.games || []);
        } else {
          setError(lobbyData.message || 'Lỗi khi tải danh sách bàn chơi');
        }

        // Gọi API stats
        const statsResponse = await fetch(`${API_BASE_URL}/api/game/lobby/stats`);
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats(statsData.data);
        }
        
      } catch (err) {
        setError('Không thể kết nối đến server');
        console.error('Error fetching lobby data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLobbyData();
  }, []);

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
      {/* Header với nút quay lại */}
      <div style={{ 
        width: '100%',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(90deg, #1d3557 60%, #14532d 100%)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 0 8px #1d3557',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Quay lại
        </button>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#ffd700', 
          margin: 0,
          fontFamily: 'Cinzel, serif', 
          textShadow: '0 2px 8px #000a'
        }}>
          🎲 Poker Lobby
        </h1>
        
        <div style={{ width: '120px' }}> {/* Spacer để cân bằng layout */}
        </div>
      </div>
      
      {/* Stats Section */}
      {stats && Object.keys(stats).length > 0 && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ffd700',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stats.totalGames || 0}
            </div>
            <div style={{ color: '#a8dadc', fontSize: '0.9rem' }}>Tổng bàn</div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ffd700',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stats.waitingGames || 0}
            </div>
            <div style={{ color: '#a8dadc', fontSize: '0.9rem' }}>Đang chờ</div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ffd700',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stats.activeGames || 0}
            </div>
            <div style={{ color: '#a8dadc', fontSize: '0.9rem' }}>Đang chơi</div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ffd700',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {stats.totalPlayers || 0}
            </div>
            <div style={{ color: '#a8dadc', fontSize: '0.9rem' }}>Người chơi</div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            ⏳ Đang tải danh sách bàn chơi...
          </div>
        </div>
      ) : error ? (
        <div style={{ 
          background: 'rgba(255,0,0,0.2)', 
          color: '#ff6b6b', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #ff6b6b',
          marginBottom: '2rem'
        }}>
          ❌ {error}
        </div>
      ) : tables.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: '1rem' }}>
            🏗️ Chưa có bàn chơi nào. Hãy tạo bàn đầu tiên!
          </p>
          <button
            style={{
              background: 'linear-gradient(90deg, #ffd700 60%, #14532d 100%)',
              color: '#222',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 0 10px #ffd700',
            }}
            onClick={() => navigate('/create-table')}
          >
            ➕ Tạo bàn chơi
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ color: '#ffd700', margin: 0 }}>
              Danh sách bàn chơi ({tables.length})
            </h2>
            <button
              style={{
                background: 'linear-gradient(90deg, #ffd700 60%, #14532d 100%)',
                color: '#222',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                boxShadow: '0 0 8px #ffd700',
              }}
              onClick={() => navigate('/create-table')}
            >
              ➕ Tạo bàn
            </button>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {tables.map((table) => (
              <div key={table.tableId} style={{
                background: 'rgba(0,0,0,0.8)',
                borderRadius: 12,
                boxShadow: '0 0 15px rgba(255,215,0,0.3)',
                border: '1px solid rgba(255,215,0,0.5)',
                padding: '1.5rem',
                color: '#fff',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 'bold', 
                    color: '#ffd700',
                    marginBottom: '0.5rem'
                  }}>
                    🃏 {table.tableName}
                  </div>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    color: '#a8dadc'
                  }}>
                    <div>🎮 {table.gameType}</div>
                    <div>👥 {table.currentPlayersCount}/{table.maxPlayers}</div>
                    <div>💰 {table.blinds.smallBlind}/{table.blinds.bigBlind}</div>
                    <div>🎯 {table.buyIn.min}-{table.buyIn.max}</div>
                    <div>👤 {table.createdBy}</div>
                  </div>
                </div>
                <button
                  style={{
                    background: 'linear-gradient(90deg, #ffd700 60%, #14532d 100%)',
                    color: '#222',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 0 10px #ffd700',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/table/${table.tableId}`);
                  }}
                >
                  🚪 Vào bàn
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Lobby;
