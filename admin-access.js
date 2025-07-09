// Simple admin access script
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
  
  // Add long-press to logo if it exists
  const logo = document.querySelector('.site-logo');
  if (logo) {
    setupLongPress(logo);
  }
  
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
  
  setupLongPress(trigger);
  
  function setupLongPress(element) {
    let timer;
    let pressing = false;
    
    // Touch events
    element.addEventListener('touchstart', function(e) {
      pressing = true;
      timer = setTimeout(function() {
        if (pressing) checkPasscode();
      }, 2000);
    }, {passive: true});
    
    element.addEventListener('touchend', function() {
      pressing = false;
      clearTimeout(timer);
    });
    
    element.addEventListener('touchcancel', function() {
      pressing = false;
      clearTimeout(timer);
    });
    
    // Mouse events
    element.addEventListener('mousedown', function() {
      pressing = true;
      timer = setTimeout(function() {
        if (pressing) checkPasscode();
      }, 2000);
    });
    
    element.addEventListener('mouseup', function() {
      pressing = false;
      clearTimeout(timer);
    });
    
    element.addEventListener('mouseleave', function() {
      pressing = false;
      clearTimeout(timer);
    });
  }
  
  function checkPasscode() {
    const input = prompt("Enter access code:");
    if (input === ADMIN_PASSCODE) {
      // Fix: Use relative path instead of absolute path
      window.location.href = "admin/login.html";
    }
    // Silent failure - no error message for wrong passcode
  }
});