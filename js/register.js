/**
 * Registration Form Handler
 * Handles form validation, submission, and success animations
 */

// Initialize Particles.js
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: ['#FFD700', '#9333EA', '#06B6D4'] },
    shape: { type: 'circle' },
    opacity: {
      value: 0.5,
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
      speed: 2,
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
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const successModal = document.getElementById('successModal');

// Auto-capitalize name inputs
document.getElementById('student1_name').addEventListener('input', function(e) {
  this.value = this.value.replace(/\b\w/g, c => c.toUpperCase());
});

document.getElementById('student2_name').addEventListener('input', function(e) {
  this.value = this.value.replace(/\b\w/g, c => c.toUpperCase());
});

// Auto-uppercase registration numbers
document.getElementById('student1_regno').addEventListener('input', function(e) {
  this.value = this.value.toUpperCase();
});

document.getElementById('student2_regno').addEventListener('input', function(e) {
  this.value = this.value.toUpperCase();
});

// Real-time team name validation
let teamNameTimeout;
document.getElementById('team_name').addEventListener('input', async function(e) {
  const teamName = this.value.trim();
  const errorElement = document.getElementById('team_name_error');
  const successIndicator = document.getElementById('team_name_success');
  
  // Clear previous timeout
  clearTimeout(teamNameTimeout);
  
  // Hide indicators
  errorElement.classList.remove('show');
  successIndicator.classList.remove('show');
  this.classList.remove('error', 'success');
  
  if (teamName.length < 3) {
    return;
  }
  
  // Debounce API call
  teamNameTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.checkTeamName}/${encodeURIComponent(teamName)}`);
      const data = await response.json();
      
      if (data.success) {
        if (data.available) {
          this.classList.add('success');
          successIndicator.classList.add('show');
        } else {
          this.classList.add('error');
          errorElement.textContent = 'Team name already taken. Choose another.';
          errorElement.classList.add('show');
        }
      }
    } catch (error) {
      console.error('Team name check error:', error);
    }
  }, 500);
});

// Form Validation
function validateForm() {
  let isValid = true;
  
  // Team Name
  const teamName = document.getElementById('team_name').value.trim();
  if (teamName.length < 3 || teamName.length > 100) {
    showFieldError('team_name', 'Team name must be 3-100 characters');
    isValid = false;
  } else if (!/^[a-zA-Z0-9\s\-]+$/.test(teamName)) {
    showFieldError('team_name', 'Only letters, numbers, spaces, and hyphens allowed');
    isValid = false;
  }
  
  // Student 1 Name
  const student1Name = document.getElementById('student1_name').value.trim();
  if (student1Name.length < 2 || !/^[a-zA-Z\s]+$/.test(student1Name)) {
    showFieldError('student1_name', 'Enter a valid name (letters only)');
    isValid = false;
  }
  
  // Student 1 Regno
  const student1Regno = document.getElementById('student1_regno').value.trim();
  if (student1Regno.length < 5 || !/^[A-Z0-9]+$/.test(student1Regno)) {
    showFieldError('student1_regno', 'Enter a valid registration number (uppercase alphanumeric)');
    isValid = false;
  }
  
  // Student 2 Name
  const student2Name = document.getElementById('student2_name').value.trim();
  if (student2Name.length < 2 || !/^[a-zA-Z\s]+$/.test(student2Name)) {
    showFieldError('student2_name', 'Enter a valid name (letters only)');
    isValid = false;
  }
  
  // Student 2 Regno
  const student2Regno = document.getElementById('student2_regno').value.trim();
  if (student2Regno.length < 5 || !/^[A-Z0-9]+$/.test(student2Regno)) {
    showFieldError('student2_regno', 'Enter a valid registration number (uppercase alphanumeric)');
    isValid = false;
  }
  
  // Year
  const year = document.getElementById('year').value;
  if (!year) {
    showFieldError('year', 'Please select academic year');
    isValid = false;
  }
  
  return isValid;
}

function showFieldError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const errorElement = document.getElementById(`${fieldName}_error`);
  
  input.classList.add('error');
  errorElement.textContent = message;
  errorElement.classList.add('show');
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.classList.remove('show');
  });
  document.querySelectorAll('input, select').forEach(el => {
    el.classList.remove('error');
  });
}

// Form Submission
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Clear previous errors
  clearErrors();
  
  // Validate form
  if (!validateForm()) {
    showToast('Please fix the errors in the form', 'error');
    return;
  }
  
  // Disable submit button
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline-block';
  
  // Gather form data
  const formData = {
    team_name: document.getElementById('team_name').value.trim(),
    student1_name: document.getElementById('student1_name').value.trim(),
    student1_regno: document.getElementById('student1_regno').value.trim(),
    student2_name: document.getElementById('student2_name').value.trim(),
    student2_regno: document.getElementById('student2_regno').value.trim(),
    year: document.getElementById('year').value
  };
  
  try {
    const response = await fetch(API_ENDPOINTS.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // Success!
      showSuccessModal(data.team_id, data.team_name);
      launchConfetti();
      form.reset();
      clearErrors();
    } else {
      // Error from server
      showToast(data.message || 'Registration failed. Please try again.', 'error');
      
      // Show specific field errors if provided
      if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach(err => {
          showFieldError(err.field, err.message);
        });
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    showToast('Network error. Please check your connection and try again.', 'error');
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
});

// Show Success Modal
function showSuccessModal(teamId, teamName) {
  document.getElementById('modalTeamId').textContent = teamId;
  document.getElementById('modalTeamName').textContent = teamName;
  successModal.classList.add('show');
}

// Close Modal
function closeModal() {
  successModal.classList.remove('show');
}

// Launch Confetti
function launchConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  
  const colors = ['#FFD700', '#FFA500', '#9333EA', '#EC4899', '#06B6D4'];
  
  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
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
