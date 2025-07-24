import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [cleanupStats, setCleanupStats] = useState(null);
  const [serverStats, setServerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy API key từ localStorage
  const getApiKey = () => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      const session = JSON.parse(adminSession);
      return session.apiKey;
    }
    return null;
  };

  // Kiểm tra authentication và load data
  useEffect(() => {
    const apiKey = getApiKey();
    if (!apiKey) {
      navigate('/admin-login');
      return;
    }
    
    loadAdminData(apiKey);
  }, [navigate]);

  const loadAdminData = async (apiKey) => {
    try {
      setLoading(true);
      
      // Test admin authentication
      const authResponse = await fetch(`${API_BASE_URL}/api/admin/`, {
        headers: {
          'x-admin-api-key': apiKey
        }
      });

      if (!authResponse.ok) {
        throw new Error('Admin authentication failed');
      }

      const authData = await authResponse.json();
      setAdminData(authData);

      // Load cleanup statistics
      const statsResponse = await fetch(`${API_BASE_URL}/api/admin/cleanup-stats`, {
        headers: {
          'x-admin-api-key': apiKey
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setCleanupStats(statsData.data);
      }

      // Load server statistics
      const serverStatsResponse = await fetch(`${API_BASE_URL}/api/admin/server-stats`, {
        headers: {
          'x-admin-api-key': apiKey
        }
      });

      if (serverStatsResponse.ok) {
        const serverStatsData = await serverStatsResponse.json();
        setServerStats(serverStatsData.data);
      }

    } catch (err) {
      console.error('❌ Admin data load error:', err);
      setError('Failed to load admin data. Please check your API key.');
      // Auto logout on auth failure
      setTimeout(() => {
        handleLogout();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCleanup = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/cleanup-tables`, {
        method: 'POST',
        headers: {
          'x-admin-api-key': apiKey
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Manual cleanup completed: ${JSON.stringify(result.data)}`);
        // Reload stats
        loadAdminData(apiKey);
      } else {
        alert('❌ Cleanup failed');
      }
    } catch (err) {
      console.error('❌ Manual cleanup error:', err);
      alert('❌ Cleanup error');
    }
  };

  const handleRefreshStats = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    try {
      const serverStatsResponse = await fetch(`${API_BASE_URL}/api/admin/server-stats`, {
        headers: {
          'x-admin-api-key': apiKey
        }
      });

      if (serverStatsResponse.ok) {
        const serverStatsData = await serverStatsResponse.json();
        setServerStats(serverStatsData.data);
        alert('✅ Thống kê đã được cập nhật!');
      } else {
        alert('❌ Không thể cập nhật thống kê');
      }
    } catch (err) {
      console.error('❌ Refresh stats error:', err);
      alert('❌ Lỗi khi cập nhật thống kê');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin-login');
  };

  if (loading) {
    return <div style={{ color: '#ffd700', textAlign: 'center', padding: '40px' }}>
      🔄 Loading admin dashboard...
    </div>;
  }

  if (error) {
    return (
      <div style={{ color: '#f00', textAlign: 'center', padding: '40px' }}>
        <h2>❌ Access Denied</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/admin-login')}>Return to Login</button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#222',
      color: '#ffd700',
      padding: '40px',
      borderRadius: '16px',
      maxWidth: '800px',
      margin: '40px auto',
      boxShadow: '0 0 20px #000a'
    }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #ffd700', paddingBottom: '20px' }}>
        <h1 style={{ color: '#fff', margin: 0 }}>🎮 Poker Admin Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <span>Welcome, Admin! | Auth: {adminData?.authMethod}</span>
          <button onClick={handleLogout} style={{
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </header>

      <div>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#ffd700' }}>� Server Statistics</h2>
          <div style={{ background: '#333', padding: '15px', borderRadius: '8px' }}>
            {serverStats ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ background: '#444', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <h4 style={{ color: '#28a745', margin: '0 0 5px 0' }}>👥 Người đang hoạt động</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{serverStats.estimatedOnlineUsers}</p>
                </div>
                <div style={{ background: '#444', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <h4 style={{ color: '#ffd700', margin: '0 0 5px 0' }}>🎮 Người đang chơi</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{serverStats.totalPlayersInGame}</p>
                </div>
                <div style={{ background: '#444', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <h4 style={{ color: '#007bff', margin: '0 0 5px 0' }}>🃏 Bàn chơi hoạt động</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{serverStats.activeTables}</p>
                  <small style={{ color: '#ccc' }}>({serverStats.tablesWithPlayers} có người chơi)</small>
                </div>
                <div style={{ background: '#444', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <h4 style={{ color: '#6f42c1', margin: '0 0 5px 0' }}>👤 Tổng người dùng</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{serverStats.totalUsers}</p>
                </div>
              </div>
            ) : (
              <p style={{ color: '#ccc' }}>Đang tải thống kê server...</p>
            )}
            
            {serverStats && (
              <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
                <p>🕐 Server uptime: {Math.floor(serverStats.serverUptime / 3600)}h {Math.floor((serverStats.serverUptime % 3600) / 60)}m</p>
                <p>⏰ Cập nhật lúc: {new Date(serverStats.timestamp).toLocaleString('vi-VN')}</p>
                {serverStats.debug && (
                  <div style={{ marginTop: '10px', padding: '10px', background: '#222', borderRadius: '4px' }}>
                    <p><strong>Debug Info:</strong></p>
                    <p>• Total Active Games: {serverStats.debug.totalActiveGames}</p>
                    {serverStats.debug.gameDetails && serverStats.debug.gameDetails.length > 0 && (
                      <div>
                        <p>• Game Details:</p>
                        {serverStats.debug.gameDetails.map((game, index) => (
                          <p key={index} style={{ marginLeft: '10px' }}>
                            - {game.tableName} ({game.tableId}): {game.playersCount} players, status: {game.status}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#ffd700' }}>�🔐 Authentication Status</h2>
          <div style={{ background: '#333', padding: '15px', borderRadius: '8px' }}>
            <p><strong>Role:</strong> {adminData?.role}</p>
            <p><strong>Auth Method:</strong> {adminData?.authMethod}</p>
            <p><strong>Status:</strong> ✅ {adminData?.message}</p>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#ffd700' }}>🧹 Table Cleanup Service</h2>
          <button 
            onClick={handleManualCleanup} 
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            🗑️ Manual Cleanup Tables
          </button>
          
          {cleanupStats && (
            <div style={{ background: '#333', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#ffd700' }}>📊 Cleanup Statistics</h3>
              <pre style={{ color: '#ccc', fontSize: '12px' }}>
                {JSON.stringify(cleanupStats, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ color: '#ffd700' }}>⚙️ Admin Actions</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.open(`${API_BASE_URL}/api/admin/cleanup-status`, '_blank')}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📈 View Cleanup Status
            </button>
            <button 
              onClick={() => navigate('/lobby')}
              style={{
                background: '#6f42c1',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🎯 View Game Lobby
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh Dashboard
            </button>
            <button 
              onClick={handleRefreshStats}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📊 Refresh Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
