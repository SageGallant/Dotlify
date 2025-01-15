/**
 * Dotlify - Export Utilities
 */
class ExportUtils {
  constructor() {
    this.filenameBase = "dotlify-aliases";
  }
  
  /**
   * Set the filename base using the base email
   */
  setFilenameBase(baseEmail) {
    const user = baseEmail.split("@")[0];
    this.filenameBase = `dotlify-aliases-${user}`;
  }
  
  /**
   * Export aliases as plain text file
   */
  exportAsText(aliases) {
    const content = aliases.join("\n");
    this.downloadFile(content, `${this.filenameBase}.txt`, "text/plain");
  }
  
  /**
   * Export aliases as CSV file
   */
  exportAsCSV(aliases) {
    let content = "Aliases\n" + aliases.join("\n");
    this.downloadFile(content, `${this.filenameBase}.csv`, "text/csv");
  }
  
  /**
   * Helper method to trigger download
   */
  downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

// Export instance
const exportUtils = new ExportUtils();
