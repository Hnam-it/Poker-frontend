// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // Game endpoints
  LOBBY: `${API_BASE_URL}/api/game/lobby`,
  LOBBY_STATS: `${API_BASE_URL}/api/game/lobby/stats`,
  CREATE_TABLE: `${API_BASE_URL}/api/game/create-table`,
  JOIN_TABLE: (tableId) => `${API_BASE_URL}/api/game/join-table/${tableId}`,
  LEAVE_TABLE: (tableId) => `${API_BASE_URL}/api/game/leave-table/${tableId}`,
  TABLE_DETAILS: (tableId) => `${API_BASE_URL}/api/game/table/${tableId}`,
  MY_GAMES: `${API_BASE_URL}/api/game/my-games`,
  SEARCH_TABLES: `${API_BASE_URL}/api/game/search`,
  
  // Admin endpoints
  ADMIN: `${API_BASE_URL}/api/admin`,
  
  // User endpoints
  USER: `${API_BASE_URL}/api/user`
};

export default API_BASE_URL;
