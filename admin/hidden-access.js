// Hidden admin access functionality for admin pages
// IMPORTANT: Change this passcode and obfuscate in production
const ADMIN_PASSCODE = "AdminPass@2025";

document.addEventListener('DOMContentLoaded', function() {
  // Create an invisible element in the bottom-left corner
  const hiddenTrigger = document.createElement('div');
  hiddenTrigger.style.position = 'fixed';
  hiddenTrigger.style.left = '0';
  hiddenTrigger.style.bottom = '0';
  hiddenTrigger.style.width = '50px';
  hiddenTrigger.style.height = '50px';
  hiddenTrigger.style.opacity = '0';
  document.body.appendChild(hiddenTrigger);
  
  // Variables to track press duration
  let pressTimer;
  let isPressed = false;
  
  // Setup long press handler
  setupLongPressHandler(hiddenTrigger);
  
  // Setup long press handler for an element
  function setupLongPressHandler(element) {
    // Touch events for mobile
    element.addEventListener('touchstart', startPress, { passive: true });
    element.addEventListener('touchend', endPress);
    element.addEventListener('touchcancel', cancelPress);
    
    // Mouse events for desktop
    element.addEventListener('mousedown', startPress);
    element.addEventListener('mouseup', endPress);
    element.addEventListener('mouseleave', cancelPress);
  }
  
  // Start the press timer
  function startPress(e) {
    if (isPressed) return;
    
    isPressed = true;
    pressTimer = setTimeout(function() {
      promptForPasscode();
    }, 2000); // 2 second long press
  }
  
  // End the press
  function endPress(e) {
    cancelPress();
  }
  
  // Cancel the press
  function cancelPress() {
    if (pressTimer) clearTimeout(pressTimer);
    isPressed = false;
  }
  
  // Prompt for passcode
  function promptForPasscode() {
    const input = prompt('Enter access code:');
    
    if (input === ADMIN_PASSCODE) {
      window.location.href = 'login.html';
    }
    // Silently fail if wrong passcode
  }
});