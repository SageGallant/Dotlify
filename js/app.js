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
