// Hidden admin access functionality for admin pages
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
  
  // Setup hidden touch area in bottom corner
  const hiddenArea = document.createElement('div');
  hiddenArea.style.position = 'fixed';
  hiddenArea.style.bottom = '0';
  hiddenArea.style.left = '0';
  hiddenArea.style.width = '50px';
  hiddenArea.style.height = '50px';
  hiddenArea.style.opacity = '0';
  document.body.appendChild(hiddenArea);
  
  // Setup long press handler
  let timer;
  let isPressed = false;
  
  // Touch events (mobile/tablet)
  hiddenArea.addEventListener('touchstart', function(e) {
    isPressed = true;
    timer = setTimeout(function() {
      if (isPressed) promptForPasscode();
    }, 2000);
  }, { passive: true });
  
  hiddenArea.addEventListener('touchend', function() {
    isPressed = false;
    clearTimeout(timer);
  });
  
  hiddenArea.addEventListener('touchcancel', function() {
    isPressed = false;
    clearTimeout(timer);
  });
  
  // Mouse events (desktop)
  hiddenArea.addEventListener('mousedown', function() {
    isPressed = true;
    timer = setTimeout(function() {
      if (isPressed) promptForPasscode();
    }, 2000);
  });
  
  hiddenArea.addEventListener('mouseup', function() {
    isPressed = false;
    clearTimeout(timer);
  });
  
  hiddenArea.addEventListener('mouseleave', function() {
    isPressed = false;
    clearTimeout(timer);
  });
  
  // Prompt for passcode
  function promptForPasscode() {
    const input = prompt('Enter access code:');
    if (input === ADMIN_PASSCODE) {
      localStorage.setItem('adminAttempt', 'true');
      window.location.href = 'login.html';
    }
    // Silent failure - no error message
  }
});