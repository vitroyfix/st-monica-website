// Mobile Menu Functionality for all pages
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

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', setupMobileMenu);

// Make functions globally available
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;