/**
 * Admin Login Handler
 */

// Initialize Particles.js
particlesJS('particles-js', {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: ['#FFD700', '#9333EA'] },
    shape: { type: 'circle' },
    opacity: {
      value: 0.4,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0.1 }
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: true, speed: 2, size_min: 0.1 }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#FFD700',
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'repulse' },
      onclick: { enable: true, mode: 'push' },
      resize: true
    }
  },
  retina_detect: true
});

// Form Elements
const form = document.getElementById('adminLoginForm');
const loginBtn = document.getElementById('loginBtn');
const btnText = loginBtn.querySelector('.btn-text');
const btnLoading = loginBtn.querySelector('.btn-loading');

// Toggle Password Visibility
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.getElementById('toggleIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}

// Form Submission
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  
  // Basic validation
  if (!username || !password) {
    showToast('Please enter username and password', 'error');
    return;
  }
  
  // Disable button
  loginBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline-block';
  
  try {
    const response = await fetch(API_ENDPOINTS.adminLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // Store token
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', username);
      
      showToast('Login successful! Redirecting...', 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 1000);
    } else {
      showToast(data.message || 'Invalid credentials', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Network error. Please check your connection.', 'error');
  } finally {
    loginBtn.disabled = false;
    btnText.style.display = 'inline-block';
    btnLoading.style.display = 'none';
  }
});

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

// Check if already logged in
if (localStorage.getItem('adminToken')) {
  window.location.href = '/admin-dashboard';
}
