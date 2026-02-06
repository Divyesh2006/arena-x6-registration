/**
 * Admin Dashboard Handler
 */

// Check authentication
const token = localStorage.getItem('adminToken');
if (!token) {
  window.location.href = '/admin-login';
}

let allTeams = [];
let filteredTeams = [];
let currentPage = 1;
const itemsPerPage = 10;
let deleteTeamId = null;

// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', function() {
  loadDashboardData();
});

// Load Dashboard Data
async function loadDashboardData() {
  try {
    // Fetch teams
    const teamsResponse = await fetch(`${API_ENDPOINTS.adminTeams}?page=1&limit=1000`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    if (teamsResponse.status === 401) {
      showToast('Session expired. Please login again.', 'error');
      setTimeout(() => {
        logout();
      }, 1500);
      return;
    }
    
    const teamsData = await teamsResponse.json();
    
    if (!teamsData.success) {
      showToast('Failed to load teams', 'error');
      return;
    }
    
    allTeams = teamsData.teams;
    filteredTeams = [...allTeams];
    
    // Fetch stats separately
    const statsResponse = await fetch(API_ENDPOINTS.adminStats, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      updateStats(statsData.stats);
    }
    
    renderTable();
    
  } catch (error) {
    console.error('Load error:', error);
    showToast('Network error. Please try again.', 'error');
  }
}
// Update Statistics
function updateStats(stats) {
  document.getElementById('totalTeams').textContent = stats.total_teams || 0;
  document.getElementById('totalStudents').textContent = (stats.total_teams * 2) || 0;
  document.getElementById('todayCount').textContent = stats.today_registrations || 0;
  
  if (allTeams.length > 0) {
    const latestTeam = allTeams[0];
    document.getElementById('latestYear').textContent = latestTeam.year || '-';
  }
}

// Render Table
function renderTable() {
  const tbody = document.getElementById('teamsTableBody');
  
  if (filteredTeams.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="no-data">
          <i class="fas fa-inbox"></i><br>
          No teams found
        </td>
      </tr>
    `;
    document.getElementById('showingInfo').textContent = 'Showing 0 of 0 teams';
    return;
  }
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageTeams = filteredTeams.slice(startIndex, endIndex);
  
  tbody.innerHTML = pageTeams.map((team, index) => `
    <tr>
      <td>${startIndex + index + 1}</td>
      <td class="team-name">${escapeHtml(team.team_name)}</td>
      <td>${escapeHtml(team.student1_name)}</td>
      <td class="regno">${escapeHtml(team.student1_regno)}</td>
      <td>${escapeHtml(team.student2_name)}</td>
      <td class="regno">${escapeHtml(team.student2_regno)}</td>
      <td><span class="year-badge">${escapeHtml(team.year)}</span></td>
      <td class="date-cell">${formatDate(team.created_at)}</td>
      <td>
        <button onclick="deleteTeam(${team.id}, '${escapeHtml(team.team_name)}')" class="btn-delete-small" title="Delete Team">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
  
  // Update pagination
  updatePagination();
  
  // Update showing info
  const showing = Math.min(endIndex, filteredTeams.length);
  document.getElementById('showingInfo').textContent = 
    `Showing ${startIndex + 1}-${showing} of ${filteredTeams.length} teams`;
}

// Update Pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous button
  html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
    <i class="fas fa-chevron-left"></i>
  </button>`;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += '<span>...</span>';
    }
  }
  
  // Next button
  html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
    <i class="fas fa-chevron-right"></i>
  </button>`;
  
  pagination.innerHTML = html;
}

// Change Page
function changePage(page) {
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
}

// Search Teams
function searchTeams() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const yearFilter = document.getElementById('yearFilter').value;
  
  filteredTeams = allTeams.filter(team => {
    const matchesSearch = 
      team.team_name.toLowerCase().includes(searchTerm) ||
      team.student1_name.toLowerCase().includes(searchTerm) ||
      team.student1_regno.toLowerCase().includes(searchTerm) ||
      team.student2_name.toLowerCase().includes(searchTerm) ||
      team.student2_regno.toLowerCase().includes(searchTerm);
    
    const matchesYear = !yearFilter || team.year === yearFilter;
    
    return matchesSearch && matchesYear;
  });
  
  currentPage = 1;
  renderTable();
}

// Filter by Year
function filterByYear() {
  searchTeams();
}

// Delete Team
function deleteTeam(id, teamName) {
  deleteTeamId = id;
  document.getElementById('deleteTeamName').textContent = teamName;
  document.getElementById('deleteModal').classList.add('show');
}

// Close Delete Modal
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('show');
  deleteTeamId = null;
}

// Confirm Delete
async function confirmDelete() {
  if (!deleteTeamId) return;
  
  try {
    const response = await fetch(`${API_ENDPOINTS.adminTeams}/${deleteTeamId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Team deleted successfully', 'success');
      closeDeleteModal();
      loadDashboardData();
    } else {
      showToast(data.message || 'Failed to delete team', 'error');
    }
  } catch (error) {
    console.error('Delete error:', error);
    showToast('Network error. Please try again.', 'error');
  }
}

// Export to Excel
async function exportToExcel() {
  showToast('Generating Excel file...', 'success');
  
  try {
    const response = await fetch(API_ENDPOINTS.adminExport, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ARENA_X6_Teams_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast('Excel file downloaded successfully!', 'success');
    } else {
      showToast('Failed to export Excel', 'error');
    }
  } catch (error) {
    console.error('Export error:', error);
    showToast('Network error. Please try again.', 'error');
  }
}

// Refresh Data
function refreshData() {
  document.getElementById('searchInput').value = '';
  document.getElementById('yearFilter').value = '';
  loadDashboardData();
  showToast('Data refreshed', 'success');
}

// Logout
function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUsername');
  window.location.href = '/admin-login';
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-IN', options);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' 
    ? '<i class="fas fa-check-circle"></i>' 
    : '<i class="fas fa-exclamation-circle"></i>';
  
  toast.innerHTML = `${icon}<span>${message}</span>`;
  
  document.getElementById('toastContainer').appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}



