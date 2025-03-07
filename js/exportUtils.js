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
/**
 * Export aliases as Excel file (XLSX)
 */
ExportUtils.prototype.exportAsExcel = function(aliases) {
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([["Aliases"], ...aliases.map(a => [a])]);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Email Aliases");
  
  // Generate and download
  XLSX.writeFile(wb, `${this.filenameBase}.xlsx`);
};

/**
 * Export aliases as PDF file
 */
ExportUtils.prototype.exportAsPDF = function(aliases) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text("Dotlify Email Aliases", 14, 20);
  
  // Add content
  doc.setFontSize(11);
  
  // Set starting position
  let yPos = 30;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add each alias
  aliases.forEach(alias => {
    // Check if we need a new page
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(alias, 14, yPos);
    yPos += 7;
  });
  
  // Save PDF
  doc.save(`${this.filenameBase}.pdf`);
};
