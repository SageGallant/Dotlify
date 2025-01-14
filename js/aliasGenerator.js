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
