// Simple admin access script for admin pages
// IMPORTANT: Change this passcode in production
const ADMIN_PASSCODE = "AdminPass@2025";

document.addEventListener('DOMContentLoaded', function() {
  // Keyboard shortcut (Ctrl+Shift+M)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
      e.preventDefault();
      checkPasscode();
    }
  });
  
  // Add invisible trigger area
  const trigger = document.createElement('div');
  trigger.style.position = 'fixed';
  trigger.style.bottom = '0';
  trigger.style.left = '0';
  trigger.style.width = '50px';
  trigger.style.height = '50px';
  trigger.style.zIndex = '9999';
  trigger.style.opacity = '0';
  document.body.appendChild(trigger);
  
  // Setup long press handler
  let timer;
  let pressing = false;
  
  // Touch events
  trigger.addEventListener('touchstart', function(e) {
    pressing = true;
    timer = setTimeout(function() {
      if (pressing) checkPasscode();
    }, 2000);
  }, {passive: true});
  
  trigger.addEventListener('touchend', function() {
    pressing = false;
    clearTimeout(timer);
  });
  
  trigger.addEventListener('touchcancel', function() {
    pressing = false;
    clearTimeout(timer);
  });
  
  // Mouse events
  trigger.addEventListener('mousedown', function() {
    pressing = true;
    timer = setTimeout(function() {
      if (pressing) checkPasscode();
    }, 2000);
  });
  
  trigger.addEventListener('mouseup', function() {
    pressing = false;
    clearTimeout(timer);
  });
  
  trigger.addEventListener('mouseleave', function() {
    pressing = false;
    clearTimeout(timer);
  });
  
  function checkPasscode() {
    const input = prompt("Enter access code:");
    if (input === ADMIN_PASSCODE) {
      // For admin pages, just reload the login page
      window.location.href = "login.html";
    }
    // Silent failure - no error message for wrong passcode
  }
});