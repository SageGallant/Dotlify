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
/**
 * Generate plus-method aliases
 */
AliasGenerator.prototype.generatePlusAliases = function(username, domain) {
  // Remove any existing plus tags
  const clean = username.split('+')[0];
  
  // Generate aliases with predefined plus tags
  this.allAliases.plus = this.plusTags.map(tag => `${clean}+${tag}@${domain}`);
  
  // Add a numbered series of plus tags
  for (let i = 1; i <= 10; i++) {
    this.allAliases.plus.push(`${clean}+${i}@${domain}`);
  }
};
/**
 * Generate domain-method aliases using domain alternatives
 */
AliasGenerator.prototype.generateDomainAliases = function(username, domain) {
  // Check if we have alternatives for this domain
  const alternatives = this.domainAlternatives[domain] || [];
  
  // Generate aliases with alternative domains
  this.allAliases.domain = alternatives.map(alt => `${username}@${alt}`);
};
/**
 * Generate combined method aliases (dot+plus, dot+domain, etc.)
 */
AliasGenerator.prototype.generateCombinedAliases = function(username, domain) {
  const clean = username.replace(/\./g, "");
  const alternatives = this.domainAlternatives[domain] || [];
  this.allAliases.combined = [];
  
  // Generate a limited set of combined aliases for demonstration
  // Combine dot method with plus method
  if (clean.length > 1) {
    const dotVariations = [
      clean.substring(0, 1) + '.' + clean.substring(1),
      clean.charAt(0) + '.' + clean.substring(1, clean.length - 1) + '.' + clean.charAt(clean.length - 1)
    ];
    
    // Add dot+plus combinations
    for (const dotVar of dotVariations) {
      for (let i = 0; i < 3; i++) { // Limit to 3 plus tags
        const tag = this.plusTags[i];
        this.allAliases.combined.push(`${dotVar}+${tag}@${domain}`);
      }
    }
    
    // Add dot+domain combinations
    for (const dotVar of dotVariations) {
      for (const alt of alternatives) {
        this.allAliases.combined.push(`${dotVar}@${alt}`);
      }
    }
  }
};
