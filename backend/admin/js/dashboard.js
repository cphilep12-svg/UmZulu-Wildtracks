/**
 * UmZulu Wildtrack - Admin Dashboard
 * Main dashboard functionality
 */

const API_URL = window.location.origin;

// State
let currentSection = 'dashboard';
let bookingsData = [];
let messagesData = [];
let safarisData = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin/login.html';
    return;
  }
  
  // Set admin username
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const usernameEl = document.getElementById('admin-username');
  if (usernameEl && user.username) {
    usernameEl.textContent = user.username;
  }
  
  // Initialize navigation
  initNavigation();
  
  // Initialize logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login.html';
    });
  }
  
  // Load initial data
  loadDashboardData();
  loadBookings();
  loadMessages();
  loadSafaris();
  
  // Initialize filters
  initFilters();
  
  // Initialize modals
  initModals();
});

// Navigation
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      
      if (section) {
        showSection(section);
        
        // Update active nav
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });
}

function showSection(section) {
  currentSection = section;
  
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(el => {
    el.classList.remove('active');
  });
  
  // Show selected section
  const sectionEl = document.getElementById(`${section}-section`);
  if (sectionEl) {
    sectionEl.classList.add('active');
  }
  
  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    messages: 'Messages',
    safaris: 'Safari Packages'
  };
  
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) {
    pageTitle.textContent = titles[section] || 'Dashboard';
  }
}

// API Helper
async function api(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken');
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const response = await fetch("https://umzulu-wildtrack.onrender.com/api/auth/login" , {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login.html';
    return;
  }
  
  return response.json();
}

// Load Dashboard Data
async function loadDashboardData() {
  try {
    // Load booking stats
    const bookingStats = await api('/api/bookings/stats/overview');
    if (bookingStats && bookingStats.success) {
      document.getElementById('stat-total-bookings').textContent = bookingStats.stats.total;
      document.getElementById('stat-pending-bookings').textContent = bookingStats.stats.pending;
      document.getElementById('stat-confirmed-bookings').textContent = bookingStats.stats.confirmed;
      
      // Render recent bookings
      const recentBookingsEl = document.getElementById('recent-bookings');
      if (recentBookingsEl && bookingStats.recentBookings) {
        recentBookingsEl.innerHTML = bookingStats.recentBookings.map(booking => `
          <div class="activity-item">
            <div class="activity-icon stat-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="activity-content">
              <h4>${escapeHtml(booking.name)}</h4>
              <p>${escapeHtml(booking.safariPackage)}</p>
            </div>
            <div class="activity-meta">
              <span class="status-badge status-${booking.status}">${booking.status}</span>
              <div class="date">${formatDate(booking.createdAt)}</div>
            </div>
          </div>
        `).join('') || '<div class="empty-state">No recent bookings</div>';
      }
    }
    
    // Load message stats
    const messageStats = await api('/api/messages/stats/overview');
    if (messageStats && messageStats.success) {
      document.getElementById('stat-unread-messages').textContent = messageStats.stats.unread;
      
      // Update badge
      const messageBadge = document.getElementById('message-badge');
      if (messageBadge && messageStats.stats.unread > 0) {
        messageBadge.textContent = messageStats.stats.unread;
        messageBadge.style.display = 'block';
      }
      
      // Render recent messages
      const recentMessagesEl = document.getElementById('recent-messages');
      if (recentMessagesEl && messageStats.recentMessages) {
        recentMessagesEl.innerHTML = messageStats.recentMessages.map(message => `
          <div class="activity-item ${message.isRead ? '' : 'unread'}">
            <div class="activity-icon stat-icon-red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div class="activity-content">
              <h4>${escapeHtml(message.name)}</h4>
              <p>${escapeHtml(message.subject)}</p>
            </div>
            <div class="activity-meta">
              <div class="date">${formatDate(message.createdAt)}</div>
            </div>
          </div>
        `).join('') || '<div class="empty-state">No recent messages</div>';
      }
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Error loading dashboard data', 'error');
  }
}

// Load Bookings
async function loadBookings() {
  try {
    const data = await api('/api/bookings');
    if (data && data.success) {
      bookingsData = data.bookings;
      renderBookings(bookingsData);
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

function renderBookings(bookings) {
  const tableBody = document.getElementById('bookings-table');
  if (!tableBody) return;
  
  if (bookings.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No bookings found</td></tr>';
    return;
  }
  
  tableBody.innerHTML = bookings.map(booking => `
    <tr>
      <td>${escapeHtml(booking.name)}</td>
      <td>${escapeHtml(booking.safariPackage)}</td>
      <td>${formatDate(booking.date)}</td>
      <td>${booking.guests}</td>
      <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="updateBookingStatus('${booking._id}', 'confirmed')">Confirm</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBooking('${booking._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateBookingStatus(id, status) {
  try {
    const data = await api(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    
    if (data && data.success) {
      showToast('Booking updated successfully', 'success');
      loadBookings();
      loadDashboardData();
    }
  } catch (error) {
    showToast('Error updating booking', 'error');
  }
}

async function deleteBooking(id) {
  if (!confirm('Are you sure you want to delete this booking?')) return;
  
  try {
    const data = await api(`/api/bookings/${id}`, {
      method: 'DELETE'
    });
    
    if (data && data.success) {
      showToast('Booking deleted successfully', 'success');
      loadBookings();
      loadDashboardData();
    }
  } catch (error) {
    showToast('Error deleting booking', 'error');
  }
}

// Load Messages
async function loadMessages() {
  try {
    const data = await api('/api/messages');
    if (data && data.success) {
      messagesData = data.messages;
      renderMessages(messagesData);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

function renderMessages(messages) {
  const container = document.getElementById('messages-list');
  if (!container) return;
  
  if (messages.length === 0) {
    container.innerHTML = '<div class="empty-state">No messages found</div>';
    return;
  }
  
  container.innerHTML = messages.map(message => `
    <div class="message-item ${message.isRead ? '' : 'unread'}" onclick="openMessage('${message._id}')">
      <div class="message-avatar">${getInitials(message.name)}</div>
      <div class="message-content">
        <h4>${escapeHtml(message.name)}</h4>
        <div class="subject">${escapeHtml(message.subject)}</div>
        <div class="preview">${escapeHtml(message.preview || message.message)}</div>
      </div>
      <div class="message-meta">
        <div class="date">${formatDate(message.createdAt)}</div>
      </div>
    </div>
  `).join('');
}

function openMessage(id) {
  const message = messagesData.find(m => m._id === id);
  if (!message) return;
  
  const modal = document.getElementById('message-modal');
  const content = document.getElementById('message-detail-content');
  
  content.innerHTML = `
    <div class="form-group">
      <label>From</label>
      <p><strong>${escapeHtml(message.name)}</strong> (${escapeHtml(message.email)})</p>
    </div>
    <div class="form-group">
      <label>Subject</label>
      <p>${escapeHtml(message.subject)}</p>
    </div>
    <div class="form-group">
      <label>Message</label>
      <p style="white-space: pre-wrap;">${escapeHtml(message.message)}</p>
    </div>
    <div class="form-group">
      <label>Received</label>
      <p>${formatDate(message.createdAt)}</p>
    </div>
  `;
  
  // Update mark read button
  const markReadBtn = document.getElementById('mark-read-btn');
  if (markReadBtn) {
    markReadBtn.style.display = message.isRead ? 'none' : 'inline-flex';
    markReadBtn.onclick = () => markMessageAsRead(id);
  }
  
  modal.style.display = 'flex';
}

async function markMessageAsRead(id) {
  try {
    const data = await api(`/api/messages/${id}/read`, {
      method: 'PUT'
    });
    
    if (data && data.success) {
      showToast('Message marked as read', 'success');
      closeModal('message-modal');
      loadMessages();
      loadDashboardData();
    }
  } catch (error) {
    showToast('Error marking message as read', 'error');
  }
}

async function deleteMessage(id) {
  if (!confirm('Are you sure you want to delete this message?')) return;
  
  try {
    const data = await api(`/api/messages/${id}`, {
      method: 'DELETE'
    });
    
    if (data && data.success) {
      showToast('Message deleted successfully', 'success');
      closeModal('message-modal');
      loadMessages();
      loadDashboardData();
    }
  } catch (error) {
    showToast('Error deleting message', 'error');
  }
}

// Load Safaris
async function loadSafaris() {
  try {
    const data = await api('/api/safaris');
    if (data && data.success) {
      safarisData = data.safaris;
      renderSafaris(safarisData);
    }
  } catch (error) {
    console.error('Error loading safaris:', error);
  }
}

function renderSafaris(safaris) {
  const container = document.getElementById('safaris-grid');
  if (!container) return;
  
  if (safaris.length === 0) {
    container.innerHTML = '<div class="empty-state">No safari packages found</div>';
    return;
  }
  
  container.innerHTML = safaris.map(safari => `
    <div class="safari-admin-card">
      <div class="safari-admin-image">
        <img src="${safari.image}" alt="${escapeHtml(safari.name)}">
      </div>
      <div class="safari-admin-content">
        <h3>${escapeHtml(safari.name)}</h3>
        <div class="safari-admin-meta">
          <span class="price">R${safari.price.toLocaleString()}</span>
          <span>${safari.duration}</span>
          <span>Max ${safari.maxGuests} guests</span>
        </div>
        <div class="safari-admin-actions">
          <span class="availability-toggle ${safari.isAvailable ? 'available' : 'unavailable'}" 
                onclick="toggleSafariAvailability('${safari._id}', ${!safari.isAvailable})">
            ${safari.isAvailable ? '✓ Available' : '✗ Unavailable'}
          </span>
          <button class="btn btn-sm btn-outline" onclick="editSafari('${safari._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteSafari('${safari._id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function toggleSafariAvailability(id, available) {
  try {
    const data = await api(`/api/safaris/${id}/toggle`, {
      method: 'PATCH'
    });
    
    if (data && data.success) {
      showToast(`Safari is now ${data.isAvailable ? 'available' : 'unavailable'}`, 'success');
      loadSafaris();
    }
  } catch (error) {
    showToast('Error updating availability', 'error');
  }
}

function editSafari(id) {
  const safari = safarisData.find(s => s._id === id);
  if (!safari) return;
  
  document.getElementById('edit-safari-id').value = safari._id;
  document.getElementById('edit-name').value = safari.name;
  document.getElementById('edit-price').value = safari.price;
  document.getElementById('edit-duration').value = safari.duration;
  document.getElementById('edit-max-guests').value = safari.maxGuests;
  document.getElementById('edit-description').value = safari.description;
  document.getElementById('edit-available').checked = safari.isAvailable;
  document.getElementById('edit-popular').checked = safari.isPopular;
  
  document.getElementById('edit-modal').style.display = 'flex';
}

async function saveSafari() {
  const id = document.getElementById('edit-safari-id').value;
  
  const data = {
    name: document.getElementById('edit-name').value,
    price: parseInt(document.getElementById('edit-price').value),
    duration: document.getElementById('edit-duration').value,
    maxGuests: parseInt(document.getElementById('edit-max-guests').value),
    description: document.getElementById('edit-description').value,
    isAvailable: document.getElementById('edit-available').checked,
    isPopular: document.getElementById('edit-popular').checked
  };
  
  try {
    const response = await api(`/api/safaris/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    if (response && response.success) {
      showToast('Safari package updated successfully', 'success');
      closeModal('edit-modal');
      loadSafaris();
    }
  } catch (error) {
    showToast('Error updating safari package', 'error');
  }
}

async function deleteSafari(id) {
  if (!confirm('Are you sure you want to delete this safari package?')) return;
  
  try {
    const data = await api(`/api/safaris/${id}`, {
      method: 'DELETE'
    });
    
    if (data && data.success) {
      showToast('Safari package deleted successfully', 'success');
      loadSafaris();
    }
  } catch (error) {
    showToast('Error deleting safari package', 'error');
  }
}

// Seed safaris
const seedBtn = document.getElementById('seed-safaris-btn');
if (seedBtn) {
  seedBtn.addEventListener('click', async () => {
    if (!confirm('This will reset all safari packages to defaults. Continue?')) return;
    
    try {
      const data = await api('/api/safaris/seed', {
        method: 'POST'
      });
      
      if (data && data.success) {
        showToast(`Seeded ${data.packages.length} safari packages`, 'success');
        loadSafaris();
      }
    } catch (error) {
      showToast('Error seeding safari packages', 'error');
    }
  });
}

// Filters
function initFilters() {
  const bookingFilter = document.getElementById('booking-filter');
  if (bookingFilter) {
    bookingFilter.addEventListener('change', (e) => {
      const status = e.target.value;
      if (status) {
        const filtered = bookingsData.filter(b => b.status === status);
        renderBookings(filtered);
      } else {
        renderBookings(bookingsData);
      }
    });
  }
  
  const messageFilter = document.getElementById('message-filter');
  if (messageFilter) {
    messageFilter.addEventListener('change', (e) => {
      const filter = e.target.value;
      if (filter === 'unread') {
        const filtered = messagesData.filter(m => !m.isRead);
        renderMessages(filtered);
      } else if (filter === 'read') {
        const filtered = messagesData.filter(m => m.isRead);
        renderMessages(filtered);
      } else {
        renderMessages(messagesData);
      }
    });
  }
}

// Modals
function initModals() {
  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.parentElement.style.display = 'none';
    });
  });
  
  // Close modal on close button
  document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').style.display = 'none';
    });
  });
  
  // Save safari button
  const saveSafariBtn = document.getElementById('save-safari-btn');
  if (saveSafariBtn) {
    saveSafariBtn.addEventListener('click', saveSafari);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Toast notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
      }
    </svg>
    <div class="toast-content">
      <h4>${type === 'success' ? 'Success' : 'Error'}</h4>
      <p>${message}</p>
    </div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Utilities
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
