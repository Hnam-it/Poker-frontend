import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { API_BASE_URL } from '../config/apiConfig';

function TableRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Kết nối Socket.IO
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    // Lấy thông tin user từ localStorage (giả sử đã login)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { id: 'guest', username: 'Guest' };

    // Join table room
    newSocket.emit('join-table', id, user.id);

    // Socket event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('player-joined', (data) => {
      setMessages(prev => [...prev, { type: 'system', message: data.message, timestamp: new Date() }]);
    });

    newSocket.on('player-left', (data) => {
      setMessages(prev => [...prev, { type: 'system', message: data.message, timestamp: new Date() }]);
    });

    newSocket.on('chat-message', (data) => {
      setMessages(prev => [...prev, { 
        type: 'chat', 
        playerId: data.playerId, 
        message: data.message, 
        timestamp: data.timestamp 
      }]);
    });

    newSocket.on('action-update', (data) => {
      setMessages(prev => [...prev, { 
        type: 'action', 
        message: `Player ${data.playerId} ${data.action}${data.amount ? ` $${data.amount}` : ''}`, 
        timestamp: data.timestamp 
      }]);
    });

    // Fetch table info
    fetchTableInfo();

    return () => {
      newSocket.emit('leave-table', id, user.id);
      newSocket.disconnect();
    };
  }, [id]);

  const fetchTableInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/game/table/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTableInfo(data);
      }
    } catch (error) {
      console.error('Error fetching table info:', error);
    }
  };

  const sendChatMessage = () => {
    if (socket && chatMessage.trim()) {
      socket.emit('table-chat', { tableId: id, message: chatMessage });
      setChatMessage('');
    }
  };

  const handlePlayerAction = (action, amount = null) => {
    if (socket) {
      socket.emit('player-action', { tableId: id, action, amount });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #222 80%, #14532d 100%)',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: "'Cinzel', 'Roboto Slab', serif",
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#ffd700', marginBottom: '0.5rem' }}>
          🃏 {tableInfo?.tableName || `Phòng chơi #${id}`}
        </h1>
        <div style={{ 
          color: isConnected ? '#4ade80' : '#ef4444',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          {isConnected ? '🟢 Đã kết nối' : '🔴 Mất kết nối'}
        </div>
      </div>

      {/* Main Game Area */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        flex: 1,
        flexDirection: window.innerWidth < 1024 ? 'column' : 'row'
      }}>
        
        {/* Poker Table */}
        <div style={{ 
          flex: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '500px'
        }}>
          <div style={{
            position: 'relative',
            width: '600px',
            height: '400px',
            maxWidth: '90vw',
            maxHeight: '60vh',
            background: 'radial-gradient(ellipse at center, #0f5132 0%, #1a5e3a 50%, #0d4a2a 100%)',
            borderRadius: '50%',
            border: '8px solid #8b4513',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Pot & Community Cards Area */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 10
            }}>
              {/* Pot */}
              <div style={{
                background: 'rgba(0,0,0,0.8)',
                color: '#ffd700',
                padding: '8px 16px',
                borderRadius: '20px',
                marginBottom: '10px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                border: '2px solid #ffd700'
              }}>
                💰 Pot: ${tableInfo?.pot || 0}
              </div>
              
              {/* Community Cards */}
              <div style={{
                display: 'flex',
                gap: '4px',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    width: '40px',
                    height: '56px',
                    background: tableInfo?.communityCards?.[i-1] ? '#fff' : 'rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    border: '2px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: '#000',
                    fontWeight: 'bold'
                  }}>
                    {tableInfo?.communityCards?.[i-1] || '?'}
                  </div>
                ))}
              </div>
              
              {/* Game Info */}
              <div style={{
                fontSize: '0.9rem',
                color: '#a8dadc',
                opacity: 0.8
              }}>
                Blinds: ${tableInfo?.blinds?.smallBlind || 10}/${tableInfo?.blinds?.bigBlind || 20}
              </div>
            </div>

            {/* Player Positions */}
            {[0,1,2,3,4,5].map(position => {
              const angle = (position * 60) - 90; // Distribute 6 seats around the table
              const radian = (angle * Math.PI) / 180;
              const radius = 180;
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;
              
              const player = tableInfo?.currentPlayers?.[position];
              
              return (
                <div key={position} style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {/* Player Avatar */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: player ? 'linear-gradient(45deg, #ffd700, #ffed4e)' : 'rgba(255,255,255,0.2)',
                    border: player ? '3px solid #ffd700' : '3px solid #666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: player ? '#333' : '#666',
                    boxShadow: player ? '0 0 15px rgba(255,215,0,0.5)' : 'none'
                  }}>
                    {player ? '👤' : '💺'}
                  </div>
                  
                  {/* Player Name & Chips */}
                  <div style={{
                    background: 'rgba(0,0,0,0.8)',
                    color: player ? '#fff' : '#666',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    minWidth: '80px',
                    border: `1px solid ${player ? '#ffd700' : '#666'}`
                  }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {player?.userId?.username || 'Empty'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#4ade80' }}>
                      ${player?.chips || 0}
                    </div>
                  </div>
                  
                  {/* Player Cards */}
                  {player && (
                    <div style={{
                      display: 'flex',
                      gap: '2px',
                      marginTop: '4px'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '32px',
                        background: '#dc2626',
                        borderRadius: '3px',
                        border: '1px solid #000',
                        fontSize: '0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}>🂠</div>
                      <div style={{
                        width: '24px',
                        height: '32px',
                        background: '#dc2626',
                        borderRadius: '3px',
                        border: '1px solid #000',
                        fontSize: '0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}>🂠</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '280px'
        }}>
          
          {/* Action Buttons */}
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h4 style={{ color: '#ffd700', marginBottom: '1rem', textAlign: 'center' }}>
              Hành động
            </h4>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => handlePlayerAction('fold')}
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                Fold
              </button>
              <button
                onClick={() => handlePlayerAction('call')}
                style={{
                  background: '#059669',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                Call
              </button>
              <button
                onClick={() => handlePlayerAction('raise', 100)}
                style={{
                  background: '#d97706',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  gridColumn: 'span 2'
                }}
              >
                Raise $100
              </button>
            </div>
          </div>

          {/* Chat & Activity */}
          <div style={{ 
            background: 'rgba(0,0,0,0.85)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: '300px'
          }}>
            <h4 style={{ color: '#ffd700', marginBottom: '1rem' }}>Chat & Hoạt động</h4>
            
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              maxHeight: '200px'
            }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ 
                  marginBottom: '0.5rem',
                  color: msg.type === 'system' ? '#ffd700' : 
                        msg.type === 'action' ? '#4ade80' : '#e5e7eb'
                }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  {' '}
                  {msg.message}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Nhập tin nhắn..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #374151',
                  backgroundColor: '#1f2937',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={sendChatMessage}
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/lobby')}
          style={{
            background: 'linear-gradient(90deg, #1d3557 60%, #14532d 100%)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 0 8px #1d3557',
          }}
        >
          ← Quay lại sảnh chơi
        </button>
      </div>
    </div>
  );
}

export default TableRoom;
