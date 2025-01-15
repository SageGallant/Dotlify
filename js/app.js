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
/**
 * Global variables for pagination and alias management
 */
let currentPage = 1;
let pageSize = 50;
let filteredAliases = [];
let allAliases = { dot: [], plus: [], domain: [], combined: [] };
let currentEmail = "";

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  currentEmail = baseEmailInput.value.trim();
  
  // Validate email
  if (!currentEmail) {
    showToast("Please enter a valid email address", 3000);
    return;
  }
  
  // Update UI - loading state
  generateBtn.disabled = true;
  generateBtn.innerText = "Generating...";
  loadingIndicator.classList.remove("hidden");
  
  // Show options and results sections
  document.getElementById("options-section").classList.remove("hidden");
  document.getElementById("results-section").classList.remove("hidden");
  
  // Generate aliases (may take time)
  setTimeout(() => {
    const result = aliasGenerator.generateAliases(currentEmail);
    allAliases = result.aliases;
    
    // Update filter checkboxes and counts
    updateAliasCounts(result.counts);
    
    // Set initial filters (all checked)
    filteredAliases = aliasGenerator.getFilteredAliases({
      dot: true,
      plus: true,
      domain: true,
      combined: true
    });
    
    // Add some randomness to order
    shuffleArray(filteredAliases);
    
    // Set up export utilities
    exportUtils.setFilenameBase(currentEmail);
    
    // Render the first page
    renderCurrentPage();
    
    // Show pagination
    document.getElementById("pagination-controls").classList.remove("hidden");
    
    // Reset UI state
    loadingIndicator.classList.add("hidden");
    generateBtn.disabled = false;
    generateBtn.innerText = "Generate";
  }, 50); // Small delay to allow UI to update first
}

/**
 * Update alias counts in the UI
 */
function updateAliasCounts(counts) {
  document.getElementById("dot-count").textContent = counts.dot;
  document.getElementById("plus-count").textContent = counts.plus;
  document.getElementById("domain-count").textContent = counts.domain;
  document.getElementById("combined-count").textContent = counts.combined;
}

/**
 * Helper to shuffle array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
