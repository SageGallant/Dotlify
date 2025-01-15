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
/**
 * Render the current page of aliases
 */
function renderCurrentPage() {
  const container = document.getElementById("aliases-container");
  container.innerHTML = "";
  
  // Calculate page range
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredAliases.length);
  
  // Update pagination info
  document.getElementById("page-start").textContent = filteredAliases.length > 0 ? startIndex + 1 : 0;
  document.getElementById("page-end").textContent = endIndex;
  document.getElementById("page-total").textContent = filteredAliases.length;
  
  // No results case
  if (filteredAliases.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "text-center py-8 text-text-muted";
    noResults.textContent = "No aliases found with current filters";
    container.appendChild(noResults);
    
    // Disable pagination buttons
    document.getElementById("prev-page").disabled = true;
    document.getElementById("next-page").disabled = true;
    document.getElementById("pagination-controls").classList.add("hidden");
    return;
  }
  
  // Enable/disable pagination buttons
  document.getElementById("prev-page").disabled = currentPage === 1;
  document.getElementById("next-page").disabled = endIndex >= filteredAliases.length;
  
  // Render page numbers
  renderPageNumbers();
  
  // Render aliases for this page
  for (let i = startIndex; i < endIndex; i++) {
    const alias = filteredAliases[i];
    const aliasItem = document.createElement("div");
    aliasItem.className = "alias-item";
    aliasItem.dataset.value = alias;
    
    const label = document.createElement("span");
    label.className = "label";
    
    // Determine method type
    if (alias.includes("+")) {
      label.textContent = "Plus method";
    } else if (alias.includes(".") && !alias.startsWith(".") && !alias.endsWith(".")) {
      label.textContent = "Dot method";
    } else if (alias.split("@")[1] !== currentEmail.split("@")[1]) {
      label.textContent = "Domain method";
    } else {
      label.textContent = "Combined method";
    }
    
    const value = document.createElement("span");
    value.className = "value";
    value.textContent = alias;
    
    aliasItem.appendChild(label);
    aliasItem.appendChild(value);
    
    // Add click to copy
    aliasItem.addEventListener("click", () => {
      navigator.clipboard.writeText(alias)
        .then(() => showToast("Copied to clipboard!"))
        .catch(err => console.error("Copy failed:", err));
    });
    
    container.appendChild(aliasItem);
  }
}

/**
 * Render page number buttons
 */
function renderPageNumbers() {
  const pageNumbers = document.getElementById("page-numbers");
  pageNumbers.innerHTML = "";
  
  const totalPages = Math.ceil(filteredAliases.length / pageSize);
  
  // Always show first page, current page, and nearby pages
  const pagesToShow = [];
  
  // Mobile optimization - show fewer pages
  const maxButtons = window.innerWidth < 640 ? 3 : 5;
  
  // Always include first and last page
  pagesToShow.push(1);
  
  // Create logical range around current page
  let rangeStart = Math.max(2, currentPage - Math.floor((maxButtons - 3) / 2));
  let rangeEnd = Math.min(totalPages - 1, rangeStart + maxButtons - 3);
  
  // Adjust range if we're near the end
  if (rangeEnd <= rangeStart) {
    rangeEnd = Math.min(totalPages - 1, rangeStart);
  }
  
  // Add range pages
  for (let i = rangeStart; i <= rangeEnd; i++) {
    if (!pagesToShow.includes(i)) {
      pagesToShow.push(i);
    }
  }
  
  // Add last page if more than one page
  if (totalPages > 1 && !pagesToShow.includes(totalPages)) {
    pagesToShow.push(totalPages);
  }
  
  // Sort pages
  pagesToShow.sort((a, b) => a - b);
  
  // Add page number buttons with ellipses
  let prevPage = 0;
  for (const pageNum of pagesToShow) {
    // Add ellipsis if there's a gap
    if (pageNum > prevPage + 1) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "pagination-ellipsis px-2 text-text-muted";
      ellipsis.textContent = "...";
      pageNumbers.appendChild(ellipsis);
    }
    
    // Add page number button
    addPageNumberButton(pageNum);
    prevPage = pageNum;
  }
  
  /**
   * Helper to add a page number button
   */
  function addPageNumberButton(pageNum) {
    const button = document.createElement("button");
    button.className = `btn-outline px-2 py-1 ${pageNum === currentPage ? 'current' : ''}`;
    button.textContent = pageNum;
    
    button.addEventListener("click", () => {
      if (pageNum !== currentPage) {
        currentPage = pageNum;
        renderCurrentPage();
      }
    });
    
    pageNumbers.appendChild(button);
  }
}
/**
 * Initialize event listeners for pagination controls
 */
function initializePaginationControls() {
  // Previous page button
  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCurrentPage();
    }
  });
  
  // Next page button
  document.getElementById("next-page").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredAliases.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderCurrentPage();
    }
  });
  
  // Page size selector
  document.getElementById("page-size").addEventListener("change", (e) => {
    pageSize = parseInt(e.target.value, 10);
    currentPage = 1; // Reset to first page
    renderCurrentPage();
  });
}

/**
 * Initialize event listeners for filter checkboxes
 */
function initializeFilterControls() {
  const filterDot = document.getElementById("filter-dot");
  const filterPlus = document.getElementById("filter-plus");
  const filterDomain = document.getElementById("filter-domain");
  const filterCombined = document.getElementById("filter-combined");
  
  const updateFilters = () => {
    filteredAliases = aliasGenerator.getFilteredAliases({
      dot: filterDot.checked,
      plus: filterPlus.checked,
      domain: filterDomain.checked,
      combined: filterCombined.checked
    });
    
    currentPage = 1; // Reset to first page
    renderCurrentPage();
  };
  
  // Add change listeners
  filterDot.addEventListener("change", updateFilters);
  filterPlus.addEventListener("change", updateFilters);
  filterDomain.addEventListener("change", updateFilters);
  filterCombined.addEventListener("change", updateFilters);
}

/**
 * Initialize event listeners for export buttons
 */
function initializeExportControls() {
  // Export buttons
  document.getElementById("export-txt").addEventListener("click", () => {
    exportUtils.exportAsText(filteredAliases);
    showToast("Exported as TXT file");
  });
  
  document.getElementById("export-csv").addEventListener("click", () => {
    exportUtils.exportAsCSV(filteredAliases);
    showToast("Exported as CSV file");
  });
  
  document.getElementById("export-xlsx").addEventListener("click", () => {
    exportUtils.exportAsExcel(filteredAliases);
    showToast("Exported as Excel file");
  });
  
  document.getElementById("export-pdf").addEventListener("click", () => {
    exportUtils.exportAsPDF(filteredAliases);
    showToast("Exported as PDF file");
  });
  
  // Randomize button
  document.getElementById("randomize-btn").addEventListener("click", () => {
    shuffleArray(filteredAliases);
    renderCurrentPage();
    showToast("Aliases randomized");
  });
  
  // Copy all button
  document.getElementById("copy-all-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(filteredAliases.join("\n"))
      .then(() => showToast("All aliases copied to clipboard!"))
      .catch(err => console.error("Copy failed:", err));
  });
}

// Connect to initialization
document.addEventListener("DOMContentLoaded", () => {
  // DOM element references
  const emailForm = document.getElementById("email-form");
  const baseEmailInput = document.getElementById("base-email");
  const generateBtn = document.getElementById("generate-btn");
  const aliasesContainer = document.getElementById("aliases-container");
  const loadingIndicator = document.getElementById("loading-indicator");
  
  // Initialize all components
  initializeTheme();
  initializePaginationControls();
  initializeFilterControls();
  initializeExportControls();
  
  // Form submission
  emailForm.addEventListener("submit", handleFormSubmit);
});
/**
 * Initialize collapsible sections
 */
function initializeCollapsibleSections() {
  const sectionHeaders = document.querySelectorAll('.section-header');
  
  sectionHeaders.forEach(header => {
    const targetId = header.dataset.target;
    const targetContent = document.getElementById(targetId);
    const toggle = header.querySelector('.section-toggle');
    
    if (!targetContent || !toggle) return;
    
    header.addEventListener('click', () => {
      // Only apply on mobile
      if (window.innerWidth < 768) {
        toggle.classList.toggle('collapsed');
        targetContent.classList.toggle('collapsed');
      }
    });
  });
}

// Add to initialization
document.addEventListener("DOMContentLoaded", () => {
  // Existing initialization...
  
  initializeCollapsibleSections();
});
