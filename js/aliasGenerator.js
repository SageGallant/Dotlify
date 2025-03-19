/**
 * Dotlify - Email Alias Generator
 * Core logic for generating email aliases using different methods
 */

class AliasGenerator {
  constructor() {
    // Storage for all generated aliases
    this.allAliases = {
      dot: [],
      plus: [],
      domain: [],
      combined: [],
    };

    // Map of domain alternatives for common email providers
    this.domainAlternatives = {
      // Google
      "gmail.com": ["googlemail.com"],

      // Microsoft
      "outlook.com": [
        "hotmail.com",
        "live.com",
        "msn.com",
        "outlook.co.uk",
        "hotmail.co.uk",
      ],

      // Yahoo
      "yahoo.com": [
        "ymail.com",
        "rocketmail.com",
        "yahoo.co.uk",
        "yahoo.ca",
        "yahoo.fr",
        "yahoo.de",
      ],

      // Apple
      "icloud.com": ["me.com", "mac.com"],

      // ProtonMail
      "protonmail.com": ["proton.me", "pm.me"],
      "proton.me": ["protonmail.com", "pm.me"],

      // AOL
      "aol.com": ["aim.com", "aol.co.uk"],

      // Zoho
      "zoho.com": ["zohomail.com", "zohomail.eu"],

      // Tutanota
      "tutanota.com": ["tutanota.de", "tutamail.com", "tuta.io"],

      // Fastmail
      "fastmail.com": ["fastmail.fm", "fastmail.to", "fastmail.mx"],

      // GMX
      "gmx.com": ["gmx.net", "gmx.de", "gmx.co.uk", "gmx.fr"],

      // Mail.com
      "mail.com": [
        "email.com",
        "usa.com",
        "consultant.com",
        "dr.com",
        "engineer.com",
        "post.com",
      ],

      // Yandex
      "yandex.com": ["yandex.ru", "yandex.ua", "ya.ru"],

      // Comcast/Xfinity
      "comcast.net": ["xfinity.com"],

      // AT&T
      "att.net": ["sbcglobal.net", "bellsouth.net"],

      // Verizon
      "verizon.net": ["vtext.com", "vzwpix.com"],

      // T-Mobile
      "t-mobile.com": ["tmomail.net"],

      // Misc German providers
      "web.de": ["email.de", "webmail.de"],
      "t-online.de": ["t-online.com", "tonline.de"],

      // Other regional email providers
      "mail.ru": ["bk.ru", "inbox.ru", "list.ru"],
      "rediffmail.com": ["rediff.com"],
      "libero.it": ["inwind.it", "iol.it"],
      "free.fr": ["aliceadsl.fr", "neuf.fr"],
    };

    // Tags for plus method - Expanded collection
    this.plusTags = [
      // Original tags - basic categories
      "social",
      "shop",
      "newsletters",
      "banking",
      "work",
      "personal",
      "spam",
      "support",
      "no-reply",
      "marketing",
      "project",
      "team",
      "finance",
      "travel",
      "receipts",
      "bills",
      "subscriptions",
      "security",
      "alerts",
      "notifications",

      // Extended categories
      "accounts",
      "admin",
      "analytics",
      "app",
      "archive",
      "backup",
      "blog",
      "booking",
      "business",
      "calendar",
      "chat",
      "community",
      "contact",
      "dev",
      "digital",
      "docs",
      "education",
      "events",
      "family",
      "forums",
      "friends",
      "games",
      "health",
      "help",
      "home",
      "hosting",
      "hr",
      "info",
      "invest",
      "jobs",
      "legal",
      "login",
      "media",
      "meetup",
      "membership",
      "news",
      "notes",
      "office",
      "orders",
      "photos",
      "premium",
      "private",
      "promo",
      "public",
      "purchases",
      "recruitment",
      "research",
      "sales",
      "school",
      "service",
      "shipping",
      "shopping",
      "signup",
      "sports",
      "storage",
      "store",
      "student",
      "studies",
      "survey",
      "tax",
      "tech",
      "testing",
      "tickets",
      "updates",
      "video",
      "web",
      "website",

      // Social media specific
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "pinterest",
      "tiktok",
      "youtube",
      "reddit",
      "discord",
      "twitch",
      "snapchat",
      "whatsapp",
      "telegram",
      "slack",
      "github",
      "tinder",
      "bumble",
      "hinge",

      // Shopping platforms
      "amazon",
      "ebay",
      "etsy",
      "walmart",
      "target",
      "bestbuy",
      "aliexpress",
      "shopify",
      "wayfair",
      "ikea",
      "homedepot",
      "costco",
      "newegg",
      "overstock",

      // Travel related
      "airbnb",
      "booking",
      "expedia",
      "hotels",
      "tripadvisor",
      "airline",
      "rental",
      "flights",
      "hotel",
      "vacation",
      "trip",
      "cruise",
      "passport",
      "visa",

      // Entertainment
      "netflix",
      "disney",
      "hulu",
      "spotify",
      "pandora",
      "apple",
      "prime",
      "hbo",
      "showtime",
      "paramount",
      "peacock",
      "audible",
      "gaming",

      // Finance specific
      "bank",
      "credit",
      "debit",
      "loan",
      "mortgage",
      "invest",
      "savings",
      "retirement",
      "paypal",
      "venmo",
      "cashapp",
      "stocks",
      "crypto",
      "tax",

      // Misc formats with keywords
      "temp",
      "test",
      "old",
      "new",
      "primary",
      "secondary",
      "alt",
      "alias",
      "recovery",
      "verify",
      "confirmation",
      "junk",
      "important",
      "priority",

      // Combination tags (categories + subcategories)
      "work-project",
      "work-team",
      "work-hr",
      "work-admin",
      "work-events",
      "shop-promo",
      "shop-receipts",
      "shop-returns",
      "shop-orders",
      "shop-support",
      "finance-tax",
      "finance-bills",
      "finance-invest",
      "finance-receipts",
      "social-events",
      "social-updates",
      "social-invites",
      "social-photos",
      "travel-bookings",
      "travel-tickets",
      "travel-hotel",
      "travel-itinerary",

      // Year-based tags
      "2023",
      "2024",
      "2025",

      // Month-based tags
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",

      // Formatted date combinations
      "jan2024",
      "feb2024",
      "mar2024",
      "apr2024",
      "may2024",
      "jun2024",
      "jul2024",
      "aug2024",
      "sep2024",
      "oct2024",
      "nov2024",
      "dec2024",

      // Quarterly tags
      "q1",
      "q2",
      "q3",
      "q4",
      "q1-2024",
      "q2-2024",
      "q3-2024",
      "q4-2024",

      // Special character variations
      "no.reply",
      "do.not.reply",
      "no_reply",
      "do_not_reply",
      "noreply",
      "donotreply",
    ];

    // Performance limits to prevent browser crashes
    this.maxDotAliases = 5000;
    this.maxCombinedAliases = 20000;
    this.maxPlusTags = 500; // Limit for numeric tags
  }

  /**
   * Parse email to extract username and domain
   * @param {string} email - The base email address
   * @returns {Object} - Object containing username and domain
   */
  parseEmail(email) {
    const atIndex = email.lastIndexOf("@");
    if (atIndex === -1) {
      throw new Error("Invalid email address");
    }

    return {
      username: email.substring(0, atIndex),
      domain: email.substring(atIndex + 1),
    };
  }

  /**
   * Generate all possible aliases for the given email
   * @param {string} email - The base email address
   * @returns {Object} - Object containing all generated aliases and counts
   */
  generateAliases(email) {
    // Reset stored aliases
    this.allAliases = {
      dot: [],
      plus: [],
      domain: [],
      combined: [],
    };

    const { username, domain } = this.parseEmail(email);

    // Generate aliases using each method
    this.generateDotAliases(username, domain);
    this.generatePlusAliases(username, domain);
    this.generateDomainAliases(username, domain);
    this.generateCombinedAliases(username, domain);

    return {
      aliases: this.allAliases,
      counts: {
        dot: this.allAliases.dot.length,
        plus: this.allAliases.plus.length,
        domain: this.allAliases.domain.length,
        combined: this.allAliases.combined.length,
        total:
          this.allAliases.dot.length +
          this.allAliases.plus.length +
          this.allAliases.domain.length +
          this.allAliases.combined.length,
      },
    };
  }

  /**
   * Generate dot method aliases by inserting dots between characters
   * @param {string} username - The username part of the email
   * @param {string} domain - The domain part of the email
   */
  generateDotAliases(username, domain) {
    // Gmail ignores dots in the username, so we can insert dots in all positions
    // First, ensure there are no dots in the username
    const cleanUsername = username.replace(/\./g, "");

    // Special case: if username is too short, we can't generate many combinations
    if (cleanUsername.length <= 1) {
      this.allAliases.dot.push(`${cleanUsername}@${domain}`);
      return;
    }

    // Generate all possible combinations of dot placements
    this.generateDotCombinations(cleanUsername, domain);
  }

  /**
   * Helper method to generate all possible dot combinations
   * @param {string} username - Clean username without dots
   * @param {string} domain - The domain part of the email
   * @param {number} position - Current position in the username
   * @param {string} current - Current combination being built
   */
  generateDotCombinations(username, domain, position = 0, current = "") {
    // If we've reached the end of the username, add this combination
    if (position === username.length) {
      // Only add if not already in the list
      const alias = `${current}@${domain}`;
      if (!this.allAliases.dot.includes(alias)) {
        this.allAliases.dot.push(alias);
      }
      return;
    }

    // Add character without a dot
    this.generateDotCombinations(
      username,
      domain,
      position + 1,
      current + username[position]
    );

    // Add character with a dot (if not at the last position)
    if (position < username.length - 1) {
      this.generateDotCombinations(
        username,
        domain,
        position + 1,
        current + username[position] + "."
      );
    }

    // Limit the number of aliases to prevent browser crashes
    if (this.allAliases.dot.length >= this.maxDotAliases) {
      return;
    }
  }

  /**
   * Generate plus method aliases by adding +tag
   * @param {string} username - The username part of the email
   * @param {string} domain - The domain part of the email
   */
  generatePlusAliases(username, domain) {
    // Base alias without plus
    const baseAlias = `${username}@${domain}`;
    this.allAliases.plus.push(baseAlias);

    // Add all predefined tags
    for (const tag of this.plusTags) {
      this.allAliases.plus.push(`${username}+${tag}@${domain}`);
    }

    // Add some numeric tags (useful for subscribing to services)
    // Limit to maxPlusTags numeric tags to avoid generating too many aliases
    for (let i = 1; i <= Math.min(500, this.maxPlusTags); i++) {
      this.allAliases.plus.push(`${username}+${i}@${domain}`);
    }

    // Add date-based tags
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Various date formats
    const dateFormats = [
      `${year}${month}`, // 202401
      `${year}-${month}`, // 2024-01
      `${month}${day}`, // 0115
      `${month}-${day}`, // 01-15
      `${month}_${day}`, // 01_15
      `${month}${day}${year}`, // 01152024
      `${month}-${day}-${year}`, // 01-15-2024
      `${month}_${day}_${year}`, // 01_15_2024
      `${day}${month}${year}`, // 15012024
      `${day}-${month}-${year}`, // 15-01-2024
      `${day}_${month}_${year}`, // 15_01_2024
      `${year}${month}${day}`, // 20240115
      `${year}-${month}-${day}`, // 2024-01-15
      `${year}_${month}_${day}`, // 2024_01_15
    ];

    // Add all date formats
    for (const dateFormat of dateFormats) {
      this.allAliases.plus.push(`${username}+${dateFormat}@${domain}`);
    }

    // Add combinations of categories with dates
    const topCategories = ["shop", "social", "work", "finance", "travel"];
    for (const category of topCategories) {
      this.allAliases.plus.push(`${username}+${category}_${year}@${domain}`);
      this.allAliases.plus.push(
        `${username}+${category}_${month}${year}@${domain}`
      );
    }
  }

  /**
   * Generate domain method aliases by using alternate domains
   * @param {string} username - The username part of the email
   * @param {string} domain - The domain part of the email
   */
  generateDomainAliases(username, domain) {
    // Add the original domain first
    this.allAliases.domain.push(`${username}@${domain}`);

    // Check if we have alternatives for this domain
    const alternatives = this.domainAlternatives[domain] || [];

    for (const altDomain of alternatives) {
      this.allAliases.domain.push(`${username}@${altDomain}`);
    }
  }

  /**
   * Generate combined aliases using all three methods together
   * @param {string} username - The username part of the email
   * @param {string} domain - The domain part of the email
   */
  generateCombinedAliases(username, domain) {
    // Get a clean username for dot combinations
    const cleanUsername = username.replace(/\./g, "");

    // Get a subset of dot combinations to avoid generating too many aliases
    // We'll limit this to a reasonable number to prevent performance issues
    const dotCombinations = [];
    this.generateLimitedDotCombinations(cleanUsername, dotCombinations);

    // Get all available domains (original + alternatives)
    const domains = [domain];
    const alternatives = this.domainAlternatives[domain] || [];
    domains.push(...alternatives);

    // Get a subset of plus tags to avoid combinatorial explosion
    // Using a more diverse set of tags for better combined coverage
    const plusTagCategories = {
      general: ["social", "shop", "work", "personal", "spam", "support"],
      platforms: [
        "amazon",
        "facebook",
        "twitter",
        "netflix",
        "spotify",
        "github",
      ],
      dates: ["2024", "jan2024", "feb2024", "q1-2024", "q2-2024"],
      special: ["no.reply", "do.not.reply", "noreply", "donotreply"],
    };

    // Combine all categories into a diverse subset
    let combinedPlusTags = [];
    Object.values(plusTagCategories).forEach((category) => {
      combinedPlusTags = combinedPlusTags.concat(category);
    });

    // Add some numeric tags
    for (let i = 1; i <= 10; i++) {
      combinedPlusTags.push(i.toString());
    }

    // Generate combined aliases (all three methods)
    // To prevent generating too many combinations, we'll limit the total number
    let count = 0;

    // Start with a few dot combinations
    for (const dotUsername of dotCombinations) {
      // Add some basic combinations without plus
      for (const domainName of domains) {
        const alias = `${dotUsername}@${domainName}`;
        if (!this.allAliases.combined.includes(alias)) {
          this.allAliases.combined.push(alias);
          count++;
        }

        // Exit early if we've generated too many aliases
        if (count >= this.maxCombinedAliases) return;
      }

      // Add combinations with plus tags
      for (const tag of combinedPlusTags) {
        for (const domainName of domains) {
          const alias = `${dotUsername}+${tag}@${domainName}`;
          if (!this.allAliases.combined.includes(alias)) {
            this.allAliases.combined.push(alias);
            count++;
          }

          // Exit early if we've generated too many aliases
          if (count >= this.maxCombinedAliases) return;
        }
      }
    }
  }

  /**
   * Generate a limited set of dot combinations to use for combined aliases
   * @param {string} username - Clean username without dots
   * @param {Array} results - Array to store results
   * @param {number} position - Current position in username
   * @param {string} current - Current combination being built
   * @param {number} maxResults - Maximum number of combinations to generate
   */
  generateLimitedDotCombinations(
    username,
    results,
    position = 0,
    current = "",
    maxResults = 100
  ) {
    // If we've reached the end of the username, add this combination
    if (position === username.length) {
      if (!results.includes(current)) {
        results.push(current);
      }
      return;
    }

    // Exit early if we've generated enough combinations
    if (results.length >= maxResults) {
      return;
    }

    // Add character without a dot
    this.generateLimitedDotCombinations(
      username,
      results,
      position + 1,
      current + username[position],
      maxResults
    );

    // Add character with a dot (if not at the last position)
    if (position < username.length - 1) {
      this.generateLimitedDotCombinations(
        username,
        results,
        position + 1,
        current + username[position] + ".",
        maxResults
      );
    }
  }

  /**
   * Get aliases filtered by selected methods
   * @param {Object} filters - Object with boolean flags for each method
   * @returns {Array} - Array of filtered aliases
   */
  getFilteredAliases(filters) {
    let filteredAliases = [];

    if (filters.dot) {
      filteredAliases = filteredAliases.concat(this.allAliases.dot);
    }

    if (filters.plus) {
      filteredAliases = filteredAliases.concat(this.allAliases.plus);
    }

    if (filters.domain) {
      filteredAliases = filteredAliases.concat(this.allAliases.domain);
    }

    if (filters.combined) {
      filteredAliases = filteredAliases.concat(this.allAliases.combined);
    }

    return filteredAliases;
  }
}

// Create a singleton instance for use throughout the app
const aliasGenerator = new AliasGenerator();
