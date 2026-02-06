/**
 * API Configuration
 * Update API_BASE_URL with your backend URL when deploying
 */

// Local development
const API_BASE_URL = 'http://localhost:3000/api';

// For production deployment, uncomment and update:
// const API_BASE_URL = 'https://your-railway-app.railway.app/api';

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
