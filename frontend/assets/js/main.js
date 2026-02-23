/**
 * UmZulu Wildtrack - Main JavaScript
 * Frontend functionality
 */

// API Configuration
const API_URL = window.location.origin.includes('localhost') 
  ? 'https://umzulu-wildtracks.onrender.com' 
  : window.location.origin;

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollAnimations();
  initNavbarScroll();
  initForms();
});

// ==================== Theme Toggle ====================
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  // Check for saved theme
  const savedTheme = localStorage.getItem('umzulu-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('umzulu-theme', newTheme);
  });
}

// ==================== Navigation ====================
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!menuToggle) return;
  
  // Toggle menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close on overlay click
  mobileNavOverlay?.addEventListener('click', closeMobileNav);
  
  // Close on link click
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });
  
  function closeMobileNav() {
    menuToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==================== Navbar Scroll Effect ====================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

// ==================== Scroll Animations ====================
function initScrollAnimations() {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.safari-card, .stat-card, .feature-content, .contact-info, .contact-form-wrapper, .team-card')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    return;
  }
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay for cards
        if (entry.target.classList.contains('safari-card') || 
            entry.target.classList.contains('stat-card') ||
            entry.target.classList.contains('team-card')) {
          entry.target.style.transitionDelay = `${index * 100}ms`;
        }
        
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements
  const animateElements = document.querySelectorAll(
    '.safari-card, .stat-card, .feature-content, .contact-info, .contact-form-wrapper, .team-card'
  );
  
  animateElements.forEach(el => observer.observe(el));
}

// ==================== Forms ====================
function initForms() {
  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  
  // Booking Form
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
    
    // Pre-select safari from URL
    const urlParams = new URLSearchParams(window.location.search);
    const safariParam = urlParams.get('safari');
    if (safariParam) {
      const safariSelect = document.getElementById('safari-package');
      if (safariSelect) {
        // Find matching option
        const options = Array.from(safariSelect.options);
        const match = options.find(opt => 
          opt.value.toLowerCase().includes(safariParam.toLowerCase())
        );
        if (match) safariSelect.value = match.value;
      }
    }
  }
  
  // Real-time validation
  document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    
    field.addEventListener('input', () => {
      const formGroup = field.closest('.form-group');
      if (formGroup) formGroup.classList.remove('has-error');
    });
  });
}

// Validate single field
function validateField(field) {
  const formGroup = field.closest('.form-group');
  if (!formGroup) return true;
  
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  // Required validation
  if (field.required && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }
  
  // Email validation
  if (isValid && field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  // Phone validation
  if (isValid && field.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
  }
  
  // Date validation
  if (isValid && field.type === 'date' && value) {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      isValid = false;
      errorMessage = 'Please select a future date';
    }
  }
  
  // Update UI
  const errorEl = formGroup.querySelector('.form-error');
  if (isValid) {
    formGroup.classList.remove('has-error');
  } else {
    formGroup.classList.add('has-error');
    if (errorEl) errorEl.textContent = errorMessage;
  }
  
  return isValid;
}

// Validate entire form
function validateForm(form) {
  const fields = form.querySelectorAll('.form-input, .form-textarea, .form-select');
  let isValid = true;
  
  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Handle contact form submit
async function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const successMessage = form.querySelector('.form-success');
  
  if (!validateForm(form)) {
    showToast('Please fix the errors in the form', 'error');
    return;
  }
  
  // Show loading
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone')?.value || '',
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  
  try {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      form.reset();
      successMessage.classList.add('show');
      showToast('Message sent successfully!', 'success');
      
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 5000);
    } else {
      throw new Error(data.message || 'Failed to send message');
    }
  } catch (error) {
    showToast(error.message || 'Error sending message. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// Handle booking form submit
async function handleBookingSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const successMessage = form.querySelector('.form-success');
  
  if (!validateForm(form)) {
    showToast('Please fix the errors in the form', 'error');
    return;
  }
  
  // Show loading
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    safariPackage: document.getElementById('safari-package').value,
    date: document.getElementById('date').value,
    guests: parseInt(document.getElementById('guests').value),
    message: document.getElementById('message')?.value || ''
  };
  
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      form.reset();
      successMessage.classList.add('show');
      showToast('Booking enquiry submitted!', 'success');
      
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 5000);
    } else {
      throw new Error(data.message || 'Failed to submit booking');
    }
  } catch (error) {
    showToast(error.message || 'Error submitting booking. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// ==================== Toast Notifications ====================
function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
      }
    </svg>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ==================== Utility Functions ====================
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== Export for global access ====================
window.UmZulu = {
  showToast,
  formatCurrency,
  formatDate,
  API_URL
};
