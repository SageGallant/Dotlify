/**
 * Dotlify - Alias Generator
 * Core logic for generating email aliases.
 */
class AliasGenerator {
  constructor() {
    this.allAliases = { dot: [], plus: [], domain: [], combined: [] };
    this.domainAlternatives = {
      "gmail.com": ["googlemail.com"],
      "outlook.com": ["hotmail.com", "live.com", "msn.com"]
    };
    this.plusTags = ["social", "shop", "work", "personal", "spam", "banking", "projects", "team"];
  }
}

// Export the AliasGenerator instance
const aliasGenerator = new AliasGenerator();
/**
 * Generate dot-method aliases by inserting dots between characters
 */
AliasGenerator.prototype.generateDotAliases = function(username, domain) {
  // Remove any existing dots from the username
  const clean = username.replace(/\./g, "");
  
  // If username is too short, just return the clean version
  if (clean.length <= 1) {
    this.allAliases.dot.push(`${clean}@${domain}`);
    return;
  }
  
  // Helper function to recursively generate dot combinations
  const generateCombinations = (str, index, combinations) => {
    if (index >= str.length - 1) {
      combinations.push(str);
      return combinations;
    }
    
    // Without a dot at this position
    generateCombinations(str, index + 1, combinations);
    
    // With a dot at this position
    const withDot = str.substring(0, index + 1) + '.' + str.substring(index + 1);
    generateCombinations(withDot, index + 2, combinations);
    
    return combinations;
  };
  
  // Get all combinations and add to dot aliases
  const combinations = generateCombinations(clean, 0, []);
  this.allAliases.dot = combinations.map(username => `${username}@${domain}`);
};
