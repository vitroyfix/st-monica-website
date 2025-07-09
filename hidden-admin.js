// Hidden admin access functionality
// IMPORTANT: Change this passcode before going live
const ADMIN_PASSCODE = "AdminPass@2025";

document.addEventListener('DOMContentLoaded', function() {
  // Setup keyboard shortcut (Ctrl+Shift+M)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
      e.preventDefault();
      promptForPasscode();
    }
  });
  
  // Setup long press on logo
  const logo = document.querySelector('.site-logo');
  if (logo) setupLongPress(logo);
  
  // Setup hidden touch area in bottom corner
  const hiddenArea = document.createElement('div');
  hiddenArea.style.position = 'fixed';
  hiddenArea.style.bottom = '0';
  hiddenArea.style.left = '0';
  hiddenArea.style.width = '50px';
  hiddenArea.style.height = '50px';
  hiddenArea.style.opacity = '0';
  document.body.appendChild(hiddenArea);
  setupLongPress(hiddenArea);
  
  // Long press handler setup
  function setupLongPress(element) {
    let timer;
    let isPressed = false;
    
    // Touch events (mobile/tablet)
    element.addEventListener('touchstart', function(e) {
      isPressed = true;
      timer = setTimeout(function() {
        if (isPressed) promptForPasscode();
      }, 2000);
    }, { passive: true });
    
    element.addEventListener('touchend', function() {
      isPressed = false;
      clearTimeout(timer);
    });
    
    element.addEventListener('touchcancel', function() {
      isPressed = false;
      clearTimeout(timer);
    });
    
    // Mouse events (desktop)
    element.addEventListener('mousedown', function() {
      isPressed = true;
      timer = setTimeout(function() {
        if (isPressed) promptForPasscode();
      }, 2000);
    });
    
    element.addEventListener('mouseup', function() {
      isPressed = false;
      clearTimeout(timer);
    });
    
    element.addEventListener('mouseleave', function() {
      isPressed = false;
      clearTimeout(timer);
    });
  }
  
  // Prompt for passcode
  function promptForPasscode() {
    const input = prompt('Enter access code:');
    if (input === ADMIN_PASSCODE) {
      localStorage.setItem('adminAttempt', 'true');
      window.location.href = 'admin/login.html';
    }
    // Silent failure - no error message
  }
});