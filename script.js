// Hamburger Menu Functions
function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('mobileNavOverlay');
  const menu = document.getElementById('mobileNavMenu');
  
  if (hamburger && overlay && menu) {
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    menu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (menu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('mobileNavOverlay');
  const menu = document.getElementById('mobileNavMenu');
  
  if (hamburger && overlay && menu) {
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    menu.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Setup mobile menu event listeners
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('mobileNavOverlay');
  const closeBtn = document.getElementById('mobileNavClose');
  const menu = document.getElementById('mobileNavMenu');
  
  // Hamburger button click
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }
  
  // Overlay click to close
  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }
  
  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu when clicking on nav links
  if (menu) {
    menu.addEventListener('click', function(e) {
      if (e.target.classList.contains('nav-link')) {
        closeMobileMenu();
      }
    });
  }
  
  // Close menu on window resize if screen becomes large
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
  
  // Handle escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

// Main script for index.html and login handling
document.addEventListener('DOMContentLoaded', function() {
  // Setup mobile menu functionality
  setupMobileMenu();
  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Simple validation
      if (!email || !password) {
        alert('Please enter both email and password');
        return;
      }
      
      // For demo purposes, accept any login
      // Store user info in localStorage WITHOUT clearing other data
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Redirect to home page
      window.location.href = 'home.html';
    });
  }
  
  // Load content for index page if needed
  if (document.getElementById('mass-schedule')) {
    loadMassSchedulePreview();
  }
  
  if (document.getElementById('carousel-slider')) {
    loadNewsCarouselPreview();
  }
});

// Load a preview of mass schedule on index page
function loadMassSchedulePreview() {
  try {
    const schedule = JSON.parse(localStorage.getItem('massSchedule') || '[]');
    const container = document.getElementById('mass-schedule');
    
    if (schedule.length > 0) {
      container.innerHTML = '';
      
      // Show only first 3 items for preview
      const previewSchedule = schedule.slice(0, 3);
      
      previewSchedule.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'schedule-card';
        card.innerHTML = `
          <h3>${entry.day}</h3>
          ${entry.times.map(time => `<div class="time">${time}</div>`).join('')}
          ${entry.type ? `<div class="type">${entry.type}</div>` : ''}
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<p class="no-schedule">No mass schedule available.</p>';
    }
  } catch (error) {
    console.error('Error loading mass schedule preview:', error);
  }
}

// Load a preview of news carousel on index page
function loadNewsCarouselPreview() {
  try {
    const news = JSON.parse(localStorage.getItem('newsCarousel') || '[]');
    const container = document.getElementById('carousel-slider');
    
    if (news.length > 0) {
      container.innerHTML = '';
      
      // Show only first 3 items for preview
      const previewNews = news.slice(0, 3);
      
      previewNews.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const imgSrc = item.imageData || item.image || '';
        
        slide.innerHTML = `
          <img src="${imgSrc}" alt="${item.message}">
          <h3>${item.message}</h3>
        `;
        container.appendChild(slide);
      });
    } else {
      container.innerHTML = '<p class="no-news">No news items available.</p>';
    }
  } catch (error) {
    console.error('Error loading news carousel preview:', error);
  }
}
// Global mobile menu functions for backward compatibility
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;