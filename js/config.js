/**
 * API Configuration
 * Update API_BASE_URL with your backend URL when deploying
 */

// Automatically detect environment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://arena-x6-registration.onrender.com/api';

// For custom deployment, manually set:
// const API_BASE_URL = 'https://your-custom-url.com/api';

const API_ENDPOINTS = {
  register: `${API_BASE_URL}/register`,
  checkTeamName: `${API_BASE_URL}/register/check-team-name`,
  adminLogin: `${API_BASE_URL}/admin/login`,
  adminTeams: `${API_BASE_URL}/admin/teams`,
  adminStats: `${API_BASE_URL}/admin/stats`,
  adminDelete: `${API_BASE_URL}/admin/teams`,
  adminExport: `${API_BASE_URL}/admin/export-excel`,
  adminLogout: `${API_BASE_URL}/admin/logout`
};
