/**
 * Dotlify - Main application logic
 */
document.addEventListener("DOMContentLoaded", () => {
  // DOM element references
  const emailForm = document.getElementById("email-form");
  const baseEmailInput = document.getElementById("base-email");
  const generateBtn = document.getElementById("generate-btn");

  // Event listeners
  emailForm.addEventListener("submit", handleFormSubmit);

  /**
   * Handle form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    const email = baseEmailInput.value.trim();
    if (!email) {
      alert("Please enter a valid email address");
      return;
    }
    console.log("Email submitted:", email);
    // More logic to be added
  }
});
/**
 * Theme toggle functionality
 */
function initializeTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  
  // Check for saved theme preference or use OS preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (savedTheme !== 'light' && prefersDark)) {
    document.documentElement.classList.add('dark-mode');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
  
  // Add toggle functionality
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
    
    // Save the preference
    if (document.documentElement.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      showToast('Switched to dark theme');
    } else {
      localStorage.setItem('theme', 'light');
      showToast('Switched to light theme');
    }
  });
}

// Add initialization to DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Existing DOM element references...
  
  // Initialize theme
  initializeTheme();
  
  // Existing event listeners...
});
/**
 * Show toast notification
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('toast-visible');
  
  setTimeout(() => {
    toast.classList.remove('toast-visible');
  }, duration);
}
