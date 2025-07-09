// admin/login.js

const form = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('error-msg');

// You can change this password later
const ADMIN_PASSWORD = 'admin123';

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (passwordInput.value === ADMIN_PASSWORD) {
    // Store login status in localStorage
    localStorage.setItem('isAdmin', 'true');
    // Redirect to admin dashboard
    window.location.href = 'admin.html';
  } else {
    errorMsg.textContent = 'Incorrect password. Please try again.';
  }
});
