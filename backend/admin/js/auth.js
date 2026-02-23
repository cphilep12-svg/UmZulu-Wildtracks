/**
 * UmZulu Wildtrack - Admin Authentication
 * Login and token management
 */

const API_URL = window.location.origin;

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    // Verify token is still valid
    verifyToken(token);
  }
});

// Login form handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    errorMessage.classList.remove('show');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = '/admin/';
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.classList.add('show');
    } finally {
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
    }
  });
}

// Verify token
async function verifyToken(token) {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Token is valid, redirect to dashboard if on login page
      if (window.location.pathname.includes('login')) {
        window.location.href = '/admin/';
      }
    } else {
      // Token is invalid, clear it
      logout();
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    logout();
  }
}

// Logout function
function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  
  if (!window.location.pathname.includes('login')) {
    window.location.href = '/admin/login.html';
  }
}

// Export for use in other scripts
window.Auth = {
  logout,
  getToken: () => localStorage.getItem('adminToken'),
  getUser: () => JSON.parse(localStorage.getItem('adminUser') || '{}')
};
