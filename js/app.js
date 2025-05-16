/**
 * Dotlify - Main Application Script
 * Handles UI interactions, rendering, and integrates the alias generator and export utilities
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const emailForm = document.getElementById("email-form");
  const baseEmailInput = document.getElementById("base-email");
  const generateBtn = document.getElementById("generate-btn");
  const optionsSection = document.getElementById("options-section");
  const resultsSection = document.getElementById("results-section");
  const loadingIndicator = document.getElementById("loading-indicator");
  const aliasesContainer = document.getElementById("aliases-container");
  const copyAllBtn = document.getElementById("copy-all-btn");
  const randomizeBtn = document.getElementById("randomize-btn");
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  // Pagination elements
  const paginationControls = document.getElementById("pagination-controls");
  const pageStartElement = document.getElementById("page-start");
  const pageEndElement = document.getElementById("page-end");
  const pageTotalElement = document.getElementById("page-total");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageNumbersContainer = document.getElementById("page-numbers");
  const pageSizeSelect = document.getElementById("page-size");

  // Filters
  const dotFilter = document.getElementById("filter-dot");
  const plusFilter = document.getElementById("filter-plus");
  const domainFilter = document.getElementById("filter-domain");
  const combinedFilter = document.getElementById("filter-combined");

  // Export buttons
  const exportTxtBtn = document.getElementById("export-txt");
  const exportCsvBtn = document.getElementById("export-csv");
  const exportXlsxBtn = document.getElementById("export-xlsx");
  const exportPdfBtn = document.getElementById("export-pdf");

  // Toast element
  const toast = document.getElementById("toast");

  // DOM elements for alias counts
  const dotCountElement = document.getElementById("dot-count");
  const plusCountElement = document.getElementById("plus-count");
  const domainCountElement = document.getElementById("domain-count");
  const combinedCountElement = document.getElementById("combined-count");

  // State
  let currentEmail = "";
  let allAliases = {
    dot: [],
    plus: [],
    domain: [],
    combined: [],
  };

  // Pagination state
  let currentPage = 1;
  let pageSize = parseInt(pageSizeSelect.value);
  let filteredAliases = [];
  let totalPages = 1;
  let pageTransitionInProgress = false;

  // Event listeners
  emailForm.addEventListener("submit", handleFormSubmit);

  // Copy all button event
  copyAllBtn.addEventListener("click", copyAllAliases);

  // Filter change events
  dotFilter.addEventListener("change", updateFilters);
  plusFilter.addEventListener("change", updateFilters);
  domainFilter.addEventListener("change", updateFilters);
  combinedFilter.addEventListener("change", updateFilters);

  // Export button events
  exportTxtBtn.addEventListener("click", () => exportAliases("txt"));
  exportCsvBtn.addEventListener("click", () => exportAliases("csv"));
  exportXlsxBtn.addEventListener("click", () => exportAliases("xlsx"));
  exportPdfBtn.addEventListener("click", () => exportAliases("pdf"));

  // Pagination events
  prevPageBtn.addEventListener("click", goToPreviousPage);
  nextPageBtn.addEventListener("click", goToNextPage);
  pageSizeSelect.addEventListener("change", changePageSize);

  // Randomize button event
  randomizeBtn.addEventListener("click", randomizeAliases);

  // Theme toggle event
  themeToggle.addEventListener("click", toggleTheme);

  // Section toggle functionality for mobile
  const sectionToggles = document.querySelectorAll(".section-toggle");
  const sectionHeaders = document.querySelectorAll(
    ".section-header[data-target]"
  );

  // Function to toggle a collapsible section
  function toggleSection(targetId) {
    const targetContent = document.getElementById(targetId);
    const toggle = document.querySelector(
      `.section-toggle[aria-label*="${
        targetId === "alias-options-content" ? "alias" : "download"
      }"]`
    );

    if (!targetContent || !toggle) return;

    // Toggle collapsed state
    toggle.classList.toggle("collapsed");
    targetContent.classList.toggle("collapsed");

    // Store collapsed state in localStorage for persistence
    const isCollapsed = targetContent.classList.contains("collapsed");
    localStorage.setItem(
      `section_${targetId}_collapsed`,
      isCollapsed.toString()
    );
  }

  // Add click listeners to section toggle buttons
  sectionToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering the header click
      const header = toggle.closest(".section-header");
      if (header) {
        const targetId = header.getAttribute("data-target");
        if (targetId) toggleSection(targetId);
      }
    });
  });

  // Add click listeners to section headers
  sectionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const targetId = header.getAttribute("data-target");
      if (targetId) toggleSection(targetId);
    });
  });

  /**
   * Initialize collapsible sections based on saved preferences or defaults
   */
  function initializeCollapsibleSections() {
    // Apply to all section headers with data-target
    sectionHeaders.forEach((header) => {
      const targetId = header.getAttribute("data-target");
      if (!targetId) return;

      const targetContent = document.getElementById(targetId);
      const toggle = header.querySelector(".section-toggle");

      if (!targetContent || !toggle) return;

      // Check localStorage for saved state, default to collapsed
      const shouldBeCollapsed =
        localStorage.getItem(`section_${targetId}_collapsed`) !== "false";

      // Apply collapsed state by default or based on saved preference
      if (shouldBeCollapsed) {
        toggle.classList.add("collapsed");
        targetContent.classList.add("collapsed");
      } else {
        toggle.classList.remove("collapsed");
        targetContent.classList.remove("collapsed");
      }
    });
  }

  /**
   * Adjust collapsible sections based on screen size
   */
  function adjustCollapsibleSectionsByScreenSize() {
    if (window.innerWidth > 768) {
      // On desktop, ensure content is visible even if toggles show collapsed state
      document.querySelectorAll(".section-content").forEach((content) => {
        // Skip if it's the Generated Aliases controls - not collapsible
        if (content.id === "alias-controls") {
          return;
        }

        // Keep the collapsed class for state tracking but ensure content is visible on desktop
        if (window.getComputedStyle(content).display === "none") {
          content.style.maxHeight = "500px";
          content.style.opacity = "1";
          content.style.overflow = "visible";
        }
      });
    } else {
      // On mobile, restore the proper collapsed state
      document
        .querySelectorAll(".section-content.collapsed")
        .forEach((content) => {
          // Skip if it's the Generated Aliases controls - not collapsible
          if (content.id === "alias-controls") {
            return;
          }

          content.style.maxHeight = "";
          content.style.opacity = "";
          content.style.overflow = "";
        });
    }
  }

  // Initialize collapsible sections when page loads - collapse all by default
  initializeCollapsibleSections();

  // Also ensure proper display on desktop vs mobile
  adjustCollapsibleSectionsByScreenSize();

  // Listen for window resize to adjust collapsible sections
  window.addEventListener("resize", adjustCollapsibleSectionsByScreenSize);

  /**
   * Handle form submission to generate aliases
   * @param {Event} e - Form submit event
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Get and validate the email
    currentEmail = baseEmailInput.value.trim();
    if (!isValidEmail(currentEmail)) {
      showError("Please enter a valid email address");
      return;
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";
    optionsSection.classList.remove("hidden");
    resultsSection.classList.remove("hidden");
    loadingIndicator.classList.remove("hidden");
    aliasesContainer.innerHTML = "";

    // Add a progress message for long email addresses
    const username = currentEmail.split("@")[0];
    if (username.length > 12) {
      loadingIndicator.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color mb-4"></div>
          <p class="text-text-primary">Processing ${username.length}-character email...</p>
          <p class="text-text-muted text-sm mt-2">Optimizing for performance (max 15,000 aliases)</p>
        </div>
      `;
    }

    // Reset pagination
    currentPage = 1;

    // Set filename base for exports
    exportUtils.setFilenameBase(currentEmail);

    // Use requestAnimationFrame for better UI responsiveness
    requestAnimationFrame(async () => {
      try {
        // Generate aliases (this may take some time for many combinations)
        const result = await generateAliasesAsync(currentEmail);
        allAliases = result.aliases;

        // Update alias count indicators
        updateAliasCounts();

        // Update filters and render first page
        updateFilters();

        // Hide loading indicator
        loadingIndicator.classList.add("hidden");
        loadingIndicator.innerHTML = `<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>`;

        // Reset button
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate";
      } catch (error) {
        console.error("Error generating aliases:", error);
        showError("An error occurred while generating aliases");

        // Reset button
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate";
        loadingIndicator.classList.add("hidden");
        loadingIndicator.innerHTML = `<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>`;
      }
    });
  }

  /**
   * Update the alias count indicators in the UI
   */
  function updateAliasCounts() {
    // Get the counts from each type of alias
    const dotCount = allAliases.dot.length;
    const plusCount = allAliases.plus.length;
    const domainCount = allAliases.domain.length;
    const combinedCount = allAliases.combined.length;

    // Update the UI elements
    dotCountElement.textContent = dotCount.toLocaleString();
    plusCountElement.textContent = plusCount.toLocaleString();
    domainCountElement.textContent = domainCount.toLocaleString();
    combinedCountElement.textContent = combinedCount.toLocaleString();

    // Add subtle animation to highlight the counts
    [
      dotCountElement,
      plusCountElement,
      domainCountElement,
      combinedCountElement,
    ].forEach((element) => {
      element.style.transform = "scale(1.2)";
      element.style.boxShadow = getGlowForElement(element.id);

      setTimeout(() => {
        element.style.transform = "";
        element.style.boxShadow = "";
      }, 800);
    });
  }

  /**
   * Get appropriate glow effect based on element ID
   * @param {string} elementId - The ID of the element
   * @returns {string} - CSS box-shadow value for glow effect
   */
  function getGlowForElement(elementId) {
    switch (elementId) {
      case "dot-count":
        return "var(--glow-primary)";
      case "plus-count":
        return "var(--glow-secondary)";
      case "domain-count":
        return "var(--glow-accent)";
      case "combined-count":
        return "var(--glow-primary), var(--glow-secondary), var(--glow-accent)";
      default:
        return "var(--glow-primary)";
    }
  }

  /**
   * Copy all currently filtered aliases to clipboard
   */
  function copyAllAliases() {
    // Use all filtered aliases, not just the current page
    if (filteredAliases.length === 0) {
      showError("No aliases to copy");
      return;
    }

    // Create a string with all aliases
    const content = filteredAliases.join("\n");

    // Copy to clipboard
    copyToClipboard(
      content,
      `Copied all ${filteredAliases.length} aliases to clipboard!`
    );
  }

  /**
   * Generate aliases asynchronously to avoid blocking the UI
   * @param {string} email - The base email address
   * @returns {Promise} - Resolves to the generated aliases and counts
   */
  function generateAliasesAsync(email) {
    return new Promise((resolve) => {
      // Check if the email username is long (performance optimization)
      const username = email.split("@")[0];
      const isLongUsername = username.length > 12;

      // For very long usernames, add more delay to allow UI updates
      const delay = isLongUsername ? 100 : 0;

      // Use setTimeout to prevent UI blocking during heavy computation
      setTimeout(() => {
        // For extremely long usernames, process in chunks with yield to UI thread
        if (username.length > 20) {
          // Let the browser breathe by yielding control back for a moment
          setTimeout(() => {
            const result = aliasGenerator.generateAliases(email);
            resolve(result);
          }, 0);
        } else {
          // Standard processing for normal usernames
          const result = aliasGenerator.generateAliases(email);
          resolve(result);
        }
      }, delay);
    });
  }

  /**
   * Update filter selection and refresh display
   */
  function updateFilters() {
    // Get filtered aliases based on selected methods
    const filters = getSelectedFilters();
    filteredAliases = aliasGenerator.getFilteredAliases(filters);

    // Randomize the order of aliases
    shuffleArray(filteredAliases);

    // Reset to first page when filters change
    currentPage = 1;

    // Update pagination
    updatePagination();

    // Render current page
    renderCurrentPage();
  }

  /**
   * Shuffle an array using the Fisher-Yates algorithm
   * @param {Array} array - The array to shuffle
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  /**
   * Update pagination controls and state
   */
  function updatePagination() {
    // Calculate total pages
    totalPages = Math.max(1, Math.ceil(filteredAliases.length / pageSize));

    // Adjust current page if needed
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    // Show pagination controls if needed
    if (filteredAliases.length > 0) {
      paginationControls.classList.remove("hidden");
    } else {
      paginationControls.classList.add("hidden");
    }

    // Update pagination info
    const start =
      filteredAliases.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, filteredAliases.length);

    pageStartElement.textContent = start;
    pageEndElement.textContent = end;
    pageTotalElement.textContent = filteredAliases.length;

    // Set button states
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    // Render page number buttons
    renderPageNumbers();
  }

  /**
   * Render page number buttons
   */
  function renderPageNumbers() {
    pageNumbersContainer.innerHTML = "";

    // Always use the simplified approach with just 3 buttons (first, current, last)
    // when there are enough pages to display
    if (totalPages <= 3) {
      // If we have 3 or fewer pages, just show all of them
      for (let i = 1; i <= totalPages; i++) {
        addPageNumberButton(i);
      }
    } else {
      // Show only first, current and last page numbers without ellipsis

      // Add first page button
      addPageNumberButton(1);

      // Add current page if it's not first or last
      if (currentPage !== 1 && currentPage !== totalPages) {
        addPageNumberButton(currentPage);
      }

      // Add last page button
      addPageNumberButton(totalPages);
    }

    // Watch for window resize to update pagination
    window.removeEventListener("resize", handleWindowResize);
    window.addEventListener("resize", handleWindowResize);
  }

  /**
   * Handle window resize to update pagination display
   */
  function handleWindowResize() {
    // Debounce the resize event
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
      renderPageNumbers();
    }, 250);
  }

  /**
   * Add a page number button to the container
   * @param {number} pageNum - The page number
   */
  function addPageNumberButton(pageNum) {
    const button = document.createElement("button");
    button.textContent = pageNum;
    button.className =
      pageNum === currentPage
        ? "bg-indigo-500 text-white"
        : "bg-white text-gray-700 hover:bg-gray-50";

    // Apply premium styling
    button.style.transition =
      "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

    if (pageNum === currentPage) {
      // Current page styling with luxurious gold accent
      button.style.backgroundColor = "var(--primary-color)";
      button.style.color = "var(--white)";
      button.style.boxShadow = "var(--glow-primary)";
      button.style.transform = "scale(1.05)";
      button.style.fontWeight = "600";
    } else {
      // Other page numbers
      button.style.backgroundColor = "var(--bg-card)";
      button.style.color = "var(--text-primary)";
      button.style.border = "1px solid var(--gray-medium)";
    }

    // Add hover effect
    button.addEventListener("mouseenter", () => {
      if (pageNum !== currentPage) {
        button.style.backgroundColor = "var(--bg-muted)";
        button.style.boxShadow = "var(--glow-secondary)";
        button.style.transform = "translateY(-2px)";
      }
    });

    button.addEventListener("mouseleave", () => {
      if (pageNum !== currentPage) {
        button.style.backgroundColor = "var(--bg-card)";
        button.style.boxShadow = "";
        button.style.transform = "";
      }
    });

    button.addEventListener("click", () => {
      if (pageNum !== currentPage) {
        goToPage(pageNum);
      }
    });

    pageNumbersContainer.appendChild(button);
  }

  /**
   * Go to a specific page
   * @param {number} pageNum - The page number to go to
   */
  function goToPage(pageNum) {
    if (
      pageNum >= 1 &&
      pageNum <= totalPages &&
      pageNum !== currentPage &&
      !pageTransitionInProgress
    ) {
      currentPage = pageNum;
      animatePageTransition();
    }
  }

  /**
   * Go to the previous page
   */
  function goToPreviousPage() {
    if (currentPage > 1 && !pageTransitionInProgress) {
      currentPage--;
      animatePageTransition();
    }
  }

  /**
   * Go to the next page
   */
  function goToNextPage() {
    if (currentPage < totalPages && !pageTransitionInProgress) {
      currentPage++;
      animatePageTransition();
    }
  }

  /**
   * Animate the transition between pages
   */
  function animatePageTransition() {
    if (pageTransitionInProgress) return;

    pageTransitionInProgress = true;

    // Add transition class
    aliasesContainer.classList.add("page-transition");

    // Wait for transition to complete
    setTimeout(() => {
      // Update pagination UI
      updatePagination();

      // Render the new page
      renderCurrentPage();

      // Remove transition class
      setTimeout(() => {
        aliasesContainer.classList.remove("page-transition");
        pageTransitionInProgress = false;
      }, 50);
    }, 150);
  }

  /**
   * Change the page size
   */
  function changePageSize() {
    if (pageTransitionInProgress) return;

    pageSize = parseInt(pageSizeSelect.value);
    currentPage = 1; // Reset to first page
    animatePageTransition();
  }

  /**
   * Get the currently selected filters
   * @returns {Object} - Object with boolean flags for each method
   */
  function getSelectedFilters() {
    return {
      dot: dotFilter.checked,
      plus: plusFilter.checked,
      domain: domainFilter.checked,
      combined: combinedFilter.checked,
    };
  }

  /**
   * Render the current page of aliases
   */
  function renderCurrentPage() {
    // Clear container
    aliasesContainer.innerHTML = "";

    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredAliases.length);

    // Get aliases for current page
    const currentPageAliases = filteredAliases.slice(startIndex, endIndex);

    // Render aliases
    renderAliases(currentPageAliases);
  }

  /**
   * Render the given aliases
   * @param {Array} aliases - Array of email aliases to render
   */
  function renderAliases(aliases) {
    // Create document fragment to minimize DOM updates
    const fragment = document.createDocumentFragment();

    // Add each alias to the fragment
    aliases.forEach((alias) => {
      const aliasItem = createAliasItem(alias, alias.split("@").pop());
      fragment.appendChild(aliasItem);
    });

    // Add fragment to container
    aliasesContainer.appendChild(fragment);
  }

  /**
   * Create and append an alias item element to the container
   * @param {string} alias - The email alias to display
   * @param {string} type - The type of alias (dot, plus, domain, or combined)
   * @returns {HTMLElement} - The created alias item element
   */
  function createAliasItem(alias, type) {
    const aliasItem = document.createElement("div");
    aliasItem.className = "alias-item";
    aliasItem.textContent = alias;
    aliasItem.dataset.alias = alias;
    aliasItem.dataset.type = type;

    // Add premium styling
    aliasItem.style.transition =
      "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    aliasItem.style.backgroundColor = "var(--bg-card)";
    aliasItem.style.borderRadius = "var(--radius-md)";
    aliasItem.style.border = "1px solid var(--gray-medium)";
    aliasItem.style.padding = "0.75rem";

    // Add colored indicator based on alias type
    const indicator = document.createElement("span");
    indicator.style.display = "inline-block";
    indicator.style.width = "8px";
    indicator.style.height = "8px";
    indicator.style.borderRadius = "50%";
    indicator.style.marginRight = "8px";

    // Set color based on alias type
    switch (type) {
      case "dot":
        indicator.style.backgroundColor = "var(--primary-color)";
        indicator.title = "Dot method";
        break;
      case "plus":
        indicator.style.backgroundColor = "var(--secondary-color)";
        indicator.title = "Plus method";
        break;
      case "domain":
        indicator.style.backgroundColor = "var(--accent-color)";
        indicator.title = "Domain method";
        break;
      case "combined":
        // Create gradient for combined
        indicator.style.background =
          "linear-gradient(135deg, var(--primary-color), var(--secondary-color), var(--accent-color))";
        indicator.title = "Combined method";
        break;
    }

    // Create wrapper for content
    const contentWrapper = document.createElement("div");
    contentWrapper.style.display = "flex";
    contentWrapper.style.alignItems = "center";
    contentWrapper.appendChild(indicator);

    // Add text in span for better control
    const textSpan = document.createElement("span");
    textSpan.textContent = alias;
    textSpan.style.textOverflow = "ellipsis";
    textSpan.style.overflow = "hidden";
    textSpan.style.whiteSpace = "nowrap";
    contentWrapper.appendChild(textSpan);

    // Clear existing content and add the wrapper
    aliasItem.textContent = "";
    aliasItem.appendChild(contentWrapper);

    // Add hover effect
    aliasItem.addEventListener("mouseenter", () => {
      aliasItem.style.transform = "translateY(-3px)";
      aliasItem.style.boxShadow =
        "var(--glow-" +
        (type === "combined"
          ? "primary"
          : type === "dot"
          ? "primary"
          : type === "plus"
          ? "secondary"
          : "accent") +
        ")";
      aliasItem.style.borderColor =
        "var(--" +
        (type === "combined"
          ? "primary"
          : type === "dot"
          ? "primary"
          : type === "plus"
          ? "secondary"
          : "accent") +
        "-color)";

      // Add copy indicator
      const copyHint = document.createElement("span");
      copyHint.textContent = "Click to copy";
      copyHint.style.position = "absolute";
      copyHint.style.right = "10px";
      copyHint.style.fontSize = "0.7rem";
      copyHint.style.opacity = "0";
      copyHint.style.color = "var(--text-secondary)";
      copyHint.style.transition = "opacity 0.2s ease";
      copyHint.className = "copy-hint";

      // Remove any existing copy hints
      const existingHint = aliasItem.querySelector(".copy-hint");
      if (existingHint) {
        aliasItem.removeChild(existingHint);
      }

      aliasItem.appendChild(copyHint);

      // Fade in the hint
      setTimeout(() => {
        copyHint.style.opacity = "1";
      }, 50);
    });

    aliasItem.addEventListener("mouseleave", () => {
      aliasItem.style.transform = "";
      aliasItem.style.boxShadow = "";
      aliasItem.style.borderColor = "var(--gray-medium)";

      // Remove copy hint
      const copyHint = aliasItem.querySelector(".copy-hint");
      if (copyHint) {
        copyHint.style.opacity = "0";
        setTimeout(() => {
          if (copyHint.parentNode === aliasItem) {
            aliasItem.removeChild(copyHint);
          }
        }, 200);
      }
    });

    // Add click event to copy the alias
    aliasItem.addEventListener("click", () => {
      const aliasText = alias; // Get the actual alias text

      navigator.clipboard
        .writeText(aliasText)
        .then(() => {
          // Add a temporary "copied" visual feedback
          aliasItem.style.backgroundColor = "var(--bg-muted)";
          aliasItem.style.boxShadow = "var(--glow-accent)";
          aliasItem.style.borderColor = "var(--accent-color)";

          // Create and add a checkmark icon
          const checkmark = document.createElement("span");
          checkmark.innerHTML = "✓";
          checkmark.style.position = "absolute";
          checkmark.style.right = "10px";
          checkmark.style.color = "var(--accent-color)";
          checkmark.style.fontWeight = "bold";
          checkmark.className = "copied-checkmark";

          // Remove any existing copy hints or checkmarks
          const existingHint = aliasItem.querySelector(".copy-hint");
          const existingCheck = aliasItem.querySelector(".copied-checkmark");
          if (existingHint) aliasItem.removeChild(existingHint);
          if (existingCheck) aliasItem.removeChild(existingCheck);

          aliasItem.appendChild(checkmark);

          // Show premium toast notification
          showToast(`Copied ${aliasText} to clipboard!`, {
            duration: 2000,
            style: `border-left: 4px solid var(--accent-color); box-shadow: var(--shadow-md), var(--glow-accent);`,
          });

          // Reset styles after animation
          setTimeout(() => {
            aliasItem.style.backgroundColor = "var(--bg-card)";
            aliasItem.style.boxShadow = "";
            aliasItem.style.borderColor = "var(--gray-medium)";

            // Remove checkmark with fade
            if (checkmark.parentNode === aliasItem) {
              checkmark.style.opacity = "0";
              setTimeout(() => {
                if (checkmark.parentNode === aliasItem) {
                  aliasItem.removeChild(checkmark);
                }
              }, 300);
            }
          }, 1000);
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
          showError("Failed to copy to clipboard");
        });
    });

    // Add relative positioning for absolute elements
    aliasItem.style.position = "relative";

    return aliasItem;
  }

  /**
   * Copy text to clipboard and show toast notification
   * @param {string} text - Text to copy
   * @param {string} successMessage - Optional custom message for successful copy
   */
  function copyToClipboard(text, successMessage = "Copied to clipboard!") {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(successMessage);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        showError("Failed to copy to clipboard");
      });
  }

  /**
   * Export aliases in the selected format
   * @param {string} format - The export format (txt, csv, xlsx, pdf)
   */
  function exportAliases(format) {
    // Export all filtered aliases, not just the current page
    if (filteredAliases.length === 0) {
      showError("No aliases to export");
      return;
    }

    // Export based on format
    try {
      switch (format) {
        case "txt":
          exportUtils.exportAsText(filteredAliases);
          break;
        case "csv":
          exportUtils.exportAsCSV(filteredAliases);
          break;
        case "xlsx":
          exportUtils.exportAsXLSX(filteredAliases);
          break;
        case "pdf":
          exportUtils.exportAsPDF(filteredAliases);
          break;
        default:
          throw new Error("Unsupported format");
      }

      showToast(
        `Exported ${filteredAliases.length} aliases as ${format.toUpperCase()}`
      );
    } catch (error) {
      console.error("Export error:", error);
      showError(`Failed to export as ${format.toUpperCase()}`);
    }
  }

  /**
   * Show an error message
   * @param {string} message - Error message to show
   */
  function showError(message) {
    alert(message); // Simple alert for errors
  }

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast options (duration, type, style)
   */
  function showToast(message, options = {}) {
    const { duration = 2000, type = "info", style = "" } = options;

    // Create or get existing toast element
    let toastElement = document.getElementById("toast");

    if (!toastElement) {
      toastElement = document.createElement("div");
      toastElement.id = "toast";
      document.body.appendChild(toastElement);
    }

    // Set content and styles
    toastElement.textContent = message;
    toastElement.className = `toast ${type} toast-visible`;

    // Apply premium styling for toast
    toastElement.style.backgroundColor = "var(--bg-card)";
    toastElement.style.color = "var(--text-primary)";
    toastElement.style.border = "1px solid var(--primary-light)";
    toastElement.style.boxShadow = "var(--shadow-md), var(--glow-primary)";
    toastElement.style.borderRadius = "var(--radius-md)";
    toastElement.style.fontWeight = "500";

    // Apply any custom styles
    if (style) {
      toastElement.style.cssText += style;
    }

    // Show the toast with animation
    setTimeout(() => {
      // Fade in
      toastElement.style.opacity = "0";
      toastElement.style.display = "block";
      toastElement.style.transform = "translateY(20px)";

      setTimeout(() => {
        toastElement.style.opacity = "1";
        toastElement.style.transform = "translateY(0)";
      }, 10);

      // Auto-hide after duration
      setTimeout(() => {
        toastElement.style.opacity = "0";
        toastElement.style.transform = "translateY(-20px)";

        // Remove the element after fade out
        setTimeout(() => {
          toastElement.style.display = "none";
        }, 300);
      }, duration);
    }, 10);
  }

  /**
   * Validate an email address
   * @param {string} email - Email address to validate
   * @returns {boolean} - Whether the email is valid
   */
  function isValidEmail(email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Randomize the order of aliases
   */
  function randomizeAliases() {
    if (pageTransitionInProgress || filteredAliases.length === 0) return;

    // Start transition animation
    pageTransitionInProgress = true;
    aliasesContainer.classList.add("page-transition");

    setTimeout(() => {
      // Randomize the order of aliases
      shuffleArray(filteredAliases);

      // Reset to first page when randomizing
      currentPage = 1;

      // Update pagination
      updatePagination();

      // Render current page
      renderCurrentPage();

      // Complete transition animation
      setTimeout(() => {
        aliasesContainer.classList.remove("page-transition");
        pageTransitionInProgress = false;
        showToast("Aliases randomized successfully!");
      }, 50);
    }, 150);
  }

  /**
   * Toggle theme with enhanced animations
   */
  function toggleTheme() {
    // Create a ripple effect on toggle
    const ripple = document.createElement("div");
    ripple.style.position = "fixed";
    ripple.style.top = "0";
    ripple.style.left = "0";
    ripple.style.width = "100vw";
    ripple.style.height = "100vh";
    ripple.style.backgroundColor = document.documentElement.classList.contains(
      "dark-mode"
    )
      ? "rgba(255, 255, 255, 0.03)"
      : "rgba(0, 0, 0, 0.03)";
    ripple.style.zIndex = "-1";
    ripple.style.opacity = "0";
    ripple.style.transition = "opacity 0.8s ease-out";
    document.body.appendChild(ripple);

    // Trigger ripple animation
    setTimeout(() => {
      ripple.style.opacity = "1";
    }, 10);

    // Toggle dark mode class on html and body with a slight delay
    setTimeout(() => {
      document.documentElement.classList.toggle("dark-mode");
      document.body.classList.toggle("dark-mode");

      // Toggle icons visibility with a crossfade effect
      const isDarkMode = document.body.classList.contains("dark-mode");

      if (isDarkMode) {
        sunIcon.style.opacity = "0";
        sunIcon.style.transform = "rotate(-90deg) scale(0.5)";
        setTimeout(() => {
          sunIcon.classList.add("hidden");
          moonIcon.classList.remove("hidden");
          setTimeout(() => {
            moonIcon.style.opacity = "1";
            moonIcon.style.transform = "rotate(0) scale(1)";
          }, 50);
        }, 300);
      } else {
        moonIcon.style.opacity = "0";
        moonIcon.style.transform = "rotate(90deg) scale(0.5)";
        setTimeout(() => {
          moonIcon.classList.add("hidden");
          sunIcon.classList.remove("hidden");
          setTimeout(() => {
            sunIcon.style.opacity = "1";
            sunIcon.style.transform = "rotate(0) scale(1)";
          }, 50);
        }, 300);
      }

      // Save preference to localStorage
      localStorage.setItem("darkMode", isDarkMode.toString());

      // Show a premium toast notification when theme changes
      const themeType = isDarkMode ? "dark" : "light";
      showToast(`Switched to ${themeType} theme`, {
        duration: 3000,
        style: `background-color: var(--bg-card); color: var(--text-primary); border-left: 4px solid var(--primary-color); box-shadow: var(--glow-primary);`,
      });

      // Remove ripple after transition
      setTimeout(() => {
        ripple.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(ripple);
        }, 800);
      }, 500);
    }, 100);
  }

  /**
   * Initialize theme based on user preference
   */
  function initializeTheme() {
    // Set initial styles for icons
    sunIcon.style.opacity = "1";
    sunIcon.style.transform = "rotate(0) scale(1)";
    moonIcon.style.opacity = "1";
    moonIcon.style.transform = "rotate(0) scale(1)";

    // Check localStorage
    const savedTheme = localStorage.getItem("darkMode");

    // Apply dark mode by default unless explicitly set to false in localStorage
    if (savedTheme !== "false") {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");

      // Save the preference if it wasn't saved before
      if (savedTheme === null) {
        localStorage.setItem("darkMode", "true");
      }
    } else {
      // Light mode is only used if explicitly set
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }

    // System preference listener will be ignored for initial load
    // but kept for future preference changes if user hasn't set a preference
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          // Only apply if the user hasn't set a preference yet
          if (localStorage.getItem("darkMode") === null) {
            if (e.matches) {
              document.documentElement.classList.add("dark-mode");
              document.body.classList.add("dark-mode");
              sunIcon.classList.add("hidden");
              moonIcon.classList.remove("hidden");
            } else {
              document.documentElement.classList.remove("dark-mode");
              document.body.classList.remove("dark-mode");
              sunIcon.classList.remove("hidden");
              moonIcon.classList.add("hidden");
            }
          }
        });
    }
  }

  // Initialize theme when page loads
  initializeTheme();
});
