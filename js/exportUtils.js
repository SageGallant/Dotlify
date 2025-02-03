/**
 * Dotlify - Export Utilities
 * Functions for exporting aliases to different file formats
 */

class ExportUtils {
  /**
   * Constructor
   */
  constructor() {
    // Default filename base
    this.filenameBase = "dotlify-aliases";
  }

  /**
   * Set the base filename for exports
   * @param {string} baseEmail - The email used to generate aliases
   */
  setFilenameBase(baseEmail) {
    // Use the base email to create a meaningful filename
    const username = baseEmail.split("@")[0];
    this.filenameBase = `dotlify-aliases-${username}`;
  }

  /**
   * Export aliases to a plain text file
   * @param {Array} aliases - Array of email aliases
   */
  exportAsText(aliases) {
    // Create a string with one alias per line
    const content = aliases.join("\n");

    // Create and download the file
    this.downloadFile(content, `${this.filenameBase}.txt`, "text/plain");
  }

  /**
   * Export aliases to a CSV file
   * @param {Array} aliases - Array of email aliases
   */
  exportAsCSV(aliases) {
    // Create CSV content with header
    let content = "Email Aliases\n";
    content += aliases.join("\n");

    // Create and download the file
    this.downloadFile(content, `${this.filenameBase}.csv`, "text/csv");
  }

  /**
   * Export aliases to an Excel file
   * @param {Array} aliases - Array of email aliases
   */
  exportAsXLSX(aliases) {
    try {
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();

      // Convert aliases to worksheet format
      const worksheet = XLSX.utils.aoa_to_sheet([
        ["Email Aliases"],
        ...aliases.map((alias) => [alias]),
      ]);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Aliases");

      // Generate the Excel file and trigger download
      XLSX.writeFile(workbook, `${this.filenameBase}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert(
        "There was an error exporting to Excel. Please try another format."
      );
    }
  }

  /**
   * Export aliases to a PDF file
   * @param {Array} aliases - Array of email aliases
   */
  exportAsPDF(aliases) {
    try {
      // Create a new PDF document
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Set font and font size
      doc.setFont("helvetica");
      doc.setFontSize(10);

      // Add title
      doc.setFontSize(16);
      doc.text("Dotlify - Email Aliases", 14, 20);
      doc.setFontSize(10);

      // Set initial y position
      let y = 30;

      // Add aliases to the document (with pagination)
      for (let i = 0; i < aliases.length; i++) {
        // Check if we need a new page (20 items per page)
        if (i > 0 && i % 40 === 0) {
          doc.addPage();
          y = 20;
        }

        // Add the alias to the document
        if (y > 280) {
          doc.addPage();
          y = 20;
        }

        doc.text(aliases[i], 14, y);
        y += 7;
      }

      // Save and download the PDF
      doc.save(`${this.filenameBase}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("There was an error exporting to PDF. Please try another format.");
    }
  }

  /**
   * Helper method to download a file
   * @param {string} content - File content
   * @param {string} filename - Name of the file
   * @param {string} contentType - MIME type of the file
   */
  downloadFile(content, filename, contentType) {
    try {
      // Create a Blob with the content
      const blob = new Blob([content], { type: contentType });

      // Use FileSaver.js to save the file
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error downloading file:", error);

      // Fallback method
      const a = document.createElement("a");
      const url = URL.createObjectURL(
        new Blob([content], { type: contentType })
      );
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
}

// Create a singleton instance for use throughout the app
const exportUtils = new ExportUtils();
