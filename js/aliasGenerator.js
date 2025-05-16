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

    // Maximum number of aliases to generate for each method
    this.maxDotAliases = 5000; // Limit dot combinations
    this.maxPlusTags = 500; // Limit plus tags
    this.maxCombinedAliases = 3000; // Increased from 500 to 3000 for combined aliases
    this.maxTotalAliases = 15000; // Global maximum for all types combined

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
    // Reset all aliases
    this.allAliases = {
      dot: [],
      plus: [],
      domain: [],
      combined: [],
    };

    const { username, domain } = this.parseEmail(email);

    // For hosted environments, we'll use more conservative limits
    // Adjust based on email length to prevent browser hangs
    const isHosted =
      typeof window !== "undefined" &&
      window.location &&
      window.location.hostname !== "localhost";

    // Set more conservative limits for hosted environments or very long usernames
    if (isHosted || username.length > 25) {
      this.maxDotAliases = 3000; // Reduce from 5000 to 3000
      this.maxCombinedAliases = 2000; // Reduce from 3000/5000 to 2000
      this.maxTotalAliases = 10000; // Reduce from 15000 to 10000
    }

    // Generate aliases using each method - order matters for performance
    // Start with the less intensive methods first
    this.generateDomainAliases(username, domain);
    this.generatePlusAliases(username, domain);

    // Calculate how many aliases we've generated so far
    let currentCount =
      this.allAliases.domain.length + this.allAliases.plus.length;

    // For very long usernames (20+ characters), we need a special approach
    // to ensure we get closer to our target total aliases
    if (username.length >= 20) {
      // For extremely long usernames on hosted environments, use even more conservative limits
      if (isHosted && username.length >= 25) {
        this.maxDotAliases = 2000;
        this.maxCombinedAliases = 1000;
        this.maxTotalAliases = 7000;
      }

      // Allocate the alias budget differently for very long usernames
      // Domain and plus aliases typically generate fixed numbers
      // So we'll distribute the remaining budget between dot and combined

      // Generate combined aliases first for long usernames
      // Set a reasonable target for combined aliases
      const combinedTarget = Math.min(this.maxCombinedAliases, 2000);

      // Save the original limits to restore later if needed
      const originalDotLimit = this.maxDotAliases;
      this.maxCombinedAliases = combinedTarget;

      // Generate combined aliases with the adjusted limit
      this.generateCombinedAliases(username, domain);
      currentCount += this.allAliases.combined.length;

      // Restore original combined limit
      this.maxCombinedAliases = originalDotLimit;

      // Adjust max dot aliases based on remaining budget
      const remainingBudget = this.maxTotalAliases - currentCount;
      this.maxDotAliases = Math.min(this.maxDotAliases, remainingBudget);

      // Generate dot aliases last for long usernames
      if (remainingBudget > 0) {
        this.generateDotAliases(username, domain);
      }
    } else {
      // For shorter usernames, use the original approach
      // Check if we should limit combined aliases further based on username length
      if (username.length > 15) {
        this.maxCombinedAliases = Math.min(this.maxCombinedAliases, 200);
      }

      // Generate combined aliases
      this.generateCombinedAliases(username, domain);
      currentCount += this.allAliases.combined.length;

      // Finally, generate dot aliases (most intensive for long usernames)
      // Adjust max dot aliases based on remaining budget
      const remainingBudget = this.maxTotalAliases - currentCount;
      this.maxDotAliases = Math.min(this.maxDotAliases, remainingBudget);
      this.generateDotAliases(username, domain);
    }

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

    // For emails with more than 12 characters, use the limited version to prevent browser hangs
    if (cleanUsername.length > 12) {
      // Generate a limited set of dot combinations
      const dotCombinations = [];
      this.generateLimitedDotCombinations(
        cleanUsername,
        dotCombinations,
        0,
        "",
        this.maxDotAliases
      );

      // Add each combination as an alias
      for (const dotUsername of dotCombinations) {
        this.allAliases.dot.push(`${dotUsername}@${domain}`);

        // Safety check to avoid exceeding maxDotAliases
        if (this.allAliases.dot.length >= this.maxDotAliases) {
          return;
        }
      }
    } else {
      // For shorter usernames, use recursive generation with proper limits
      this.generateDotCombinations(cleanUsername, domain);
    }
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

    // Exit early if we've generated too many aliases
    if (this.allAliases.dot.length >= this.maxDotAliases) {
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

    // Determine the maximum number of combined aliases based on username length
    let targetCombinedAliases = this.maxCombinedAliases;

    // Check if we're on a hosted environment to adjust settings
    const isHosted =
      typeof window !== "undefined" &&
      window.location &&
      window.location.hostname !== "localhost";

    // For very long usernames (20+ chars), adjust the combined alias limit
    // to make better use of our total alias budget
    if (cleanUsername.length >= 20) {
      // Calculate how many aliases we've generated from other methods
      const otherAliasesCount =
        this.allAliases.dot.length +
        this.allAliases.plus.length +
        this.allAliases.domain.length;

      // Adjust the combined alias limit to try to reach closer to our total limit
      const remainingBudget = this.maxTotalAliases - otherAliasesCount;

      // For hosted environments, use more conservative limits
      if (isHosted) {
        targetCombinedAliases = Math.min(2000, remainingBudget);
      } else {
        targetCombinedAliases = Math.min(5000, remainingBudget);
      }
    }

    // Get a subset of dot combinations to avoid generating too many aliases
    // We'll limit this to a reasonable number to prevent performance issues
    const dotCombinations = [];

    // For very long usernames, adjust dot combination limit based on environment
    const dotLimit =
      cleanUsername.length >= 20
        ? isHosted
          ? 75
          : 150 // More conservative for hosted environments
        : 50;

    this.generateLimitedDotCombinations(
      cleanUsername,
      dotCombinations,
      0,
      "",
      dotLimit
    );

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

    // For long usernames on hosted environments, be more selective with plus tags
    if (cleanUsername.length >= 20) {
      if (isHosted) {
        // Use a smaller set of plus tags for hosted environments with long usernames
        plusTagCategories.extended = [
          "newsletter",
          "receipts",
          "finance",
          "security",
          "travel",
        ];
      } else {
        // Use the full set for non-hosted environments
        plusTagCategories.extended = [
          "newsletter",
          "receipts",
          "bills",
          "banking",
          "finance",
          "security",
          "alerts",
          "bookings",
          "travel",
          "gaming",
        ];

        plusTagCategories.services = [
          "google",
          "apple",
          "microsoft",
          "linkedin",
          "instagram",
          "youtube",
          "tiktok",
          "reddit",
          "discord",
        ];
      }
    }

    // Combine all categories into a diverse subset
    let combinedPlusTags = [];
    Object.values(plusTagCategories).forEach((category) => {
      combinedPlusTags = combinedPlusTags.concat(category);
    });

    // Add some numeric tags - use fewer for hosted environments
    const numericTagCount =
      cleanUsername.length >= 20 ? (isHosted ? 10 : 20) : 10;
    for (let i = 1; i <= numericTagCount; i++) {
      combinedPlusTags.push(i.toString());
    }

    // Generate combined aliases (all three methods)
    // To prevent generating too many combinations, we'll limit the total number
    let count = 0;

    // For extremely long usernames on hosted environments, use a more optimized strategy
    if (isHosted && cleanUsername.length >= 25) {
      // Priority-based generation strategy
      // Only generate the most useful combinations to stay within limits

      // 1. Add base combinations (dot method + domain method) for a subset of dot usernames
      const dotUsernamesToUse = dotCombinations.slice(
        0,
        Math.min(20, dotCombinations.length)
      );
      for (const dotUsername of dotUsernamesToUse) {
        for (const domainName of domains) {
          const alias = `${dotUsername}@${domainName}`;
          if (!this.allAliases.combined.includes(alias)) {
            this.allAliases.combined.push(alias);
            count++;
          }

          if (count >= targetCombinedAliases) return;
        }
      }

      // 2. Add the most important plus tag combinations
      const priorityTags = [
        "social",
        "shop",
        "work",
        "finance",
        "security",
        "2024",
      ];
      for (const dotUsername of dotUsernamesToUse) {
        for (const tag of priorityTags) {
          for (const domainName of domains) {
            const alias = `${dotUsername}+${tag}@${domainName}`;
            if (!this.allAliases.combined.includes(alias)) {
              this.allAliases.combined.push(alias);
              count++;
            }

            if (count >= targetCombinedAliases) return;
          }
        }
      }

      // 3. If we still have room, add some numeric tags
      if (count < targetCombinedAliases) {
        for (const dotUsername of dotUsernamesToUse) {
          for (let i = 1; i <= 5; i++) {
            for (const domainName of domains) {
              const alias = `${dotUsername}+${i}@${domainName}`;
              if (!this.allAliases.combined.includes(alias)) {
                this.allAliases.combined.push(alias);
                count++;
              }

              if (count >= targetCombinedAliases) return;
            }
          }
        }
      }
    } else {
      // Standard generation approach for non-extreme cases
      for (const dotUsername of dotCombinations) {
        // Add basic combinations without plus
        for (const domainName of domains) {
          const alias = `${dotUsername}@${domainName}`;
          if (!this.allAliases.combined.includes(alias)) {
            this.allAliases.combined.push(alias);
            count++;
          }

          // Exit early if we've generated too many aliases
          if (count >= targetCombinedAliases) return;
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
            if (count >= targetCombinedAliases) return;
          }
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

    // For longer usernames, use a smarter algorithm to avoid explosion
    // For long usernames (15+ chars), we'll generate a representative sample
    // instead of trying all possible combinations
    if (username.length >= 15 && position === 0) {
      // Add the original username without dots
      results.push(username);

      // Add username with a dot after the first character
      results.push(username[0] + "." + username.substring(1));

      // Add username with a dot before the last character
      results.push(
        username.substring(0, username.length - 1) +
          "." +
          username[username.length - 1]
      );

      // Add username with dots in strategic positions (every 3rd character)
      let dotted = "";
      for (let i = 0; i < username.length; i++) {
        dotted += username[i];
        if (i > 0 && i < username.length - 1 && i % 3 === 0) {
          dotted += ".";
        }
      }
      results.push(dotted);

      // For very long usernames (20+ chars), use a more optimized approach
      // that's friendlier to hosted environments
      if (username.length >= 20) {
        // Use more systematic patterns instead of random generation
        // This reduces computational complexity and memory usage

        // Pattern 1: Add a single dot at strategic positions
        const positions = [1, 3, 5, 7, 9, 12, 15, 18];
        for (const pos of positions) {
          if (pos < username.length - 1) {
            const variant = username.slice(0, pos) + "." + username.slice(pos);
            if (!results.includes(variant)) {
              results.push(variant);
            }
          }
        }

        // Pattern 2: Add dots at regular intervals (every nth character)
        const intervals = [2, 3, 4, 5];
        for (const interval of intervals) {
          let variant = "";
          for (let i = 0; i < username.length; i++) {
            variant += username[i];
            if (i > 0 && i < username.length - 1 && i % interval === 0) {
              variant += ".";
            }
          }
          if (!results.includes(variant)) {
            results.push(variant);
          }
        }

        // Pattern 3: Divide the username into segments with dots
        const segments = [2, 3, 4];
        for (const segment of segments) {
          let variant = "";
          for (let i = 0; i < username.length; i++) {
            variant += username[i];
            if (i > 0 && i < username.length - 1 && i % segment === 0) {
              variant += ".";
            }
          }
          if (!results.includes(variant)) {
            results.push(variant);
          }
        }

        // If we need more variations, use a deterministic approach instead of random
        const remainingCount = maxResults - results.length;
        if (remainingCount > 0) {
          // Generate a large number of variations using a deterministic approach
          // This is more efficient than random generation
          const batchSize = Math.min(500, remainingCount);

          // Use several different patterns to create variations
          for (
            let patternType = 0;
            patternType < 5 && results.length < maxResults;
            patternType++
          ) {
            for (let i = 0; i < batchSize && results.length < maxResults; i++) {
              let variant = "";

              // Different pattern types for variety
              switch (patternType) {
                case 0:
                  // Pattern: dot every (i % 5) + 2 characters
                  for (let j = 0; j < username.length; j++) {
                    variant += username[j];
                    if (
                      j > 0 &&
                      j < username.length - 1 &&
                      j % ((i % 5) + 2) === 0
                    ) {
                      variant += ".";
                    }
                  }
                  break;

                case 1:
                  // Pattern: dot at positions based on a repeating pattern
                  for (let j = 0; j < username.length; j++) {
                    variant += username[j];
                    if (j < username.length - 1 && (j + i) % 7 < 2) {
                      variant += ".";
                    }
                  }
                  break;

                case 2:
                  // Pattern: dot after specific characters based on their position
                  for (let j = 0; j < username.length; j++) {
                    variant += username[j];
                    if (j < username.length - 1 && ((j * i) % 17) % 4 === 0) {
                      variant += ".";
                    }
                  }
                  break;

                case 3:
                  // Pattern: dot based on character position relative to username length
                  for (let j = 0; j < username.length; j++) {
                    variant += username[j];
                    const relativePos = j / username.length;
                    if (
                      j < username.length - 1 &&
                      relativePos > 0.2 &&
                      relativePos < 0.8 &&
                      j % ((i % 4) + 2) === 0
                    ) {
                      variant += ".";
                    }
                  }
                  break;

                case 4:
                  // Pattern: dots at prime number positions
                  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
                  for (let j = 0; j < username.length; j++) {
                    variant += username[j];
                    if (
                      j < username.length - 1 &&
                      primes.includes((j + i) % 29)
                    ) {
                      variant += ".";
                    }
                  }
                  break;
              }

              // Only add unique variants to save memory
              if (!results.includes(variant)) {
                results.push(variant);

                // Exit if we've reached the maximum
                if (results.length >= maxResults) {
                  return;
                }
              }
            }
          }
        }
      } else {
        // For usernames between 15-19 chars, use a simplified approach
        // Generate a moderate number of variations with a systematic pattern
        const variationsToGenerate = Math.min(maxResults - results.length, 500);

        for (
          let i = 0;
          i < variationsToGenerate && results.length < maxResults;
          i++
        ) {
          let variant = "";
          for (let j = 0; j < username.length; j++) {
            variant += username[j];
            // Use a deterministic pattern based on position and iteration
            if (j < username.length - 1 && (j + i) % 5 === 0) {
              variant += ".";
            }
          }

          if (!results.includes(variant)) {
            results.push(variant);
          }

          // If we've reached the maximum, exit early
          if (results.length >= maxResults) {
            return;
          }
        }
      }

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
