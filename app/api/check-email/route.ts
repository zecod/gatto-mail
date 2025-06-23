import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";
import { randomBytes } from "crypto";

// @ts-expect-error: No type definitions for smtp-connection
import SMTPConnection from "smtp-connection";

// Rate limiting and anti-blocking class
class EmailChecker {
  private lastCheck = new Map<string, number>(); // domain -> timestamp
  private failCount = new Map<string, number>(); // domain -> failure count
  private blockedDomains = new Set<string>(); // domains that are blocking us

  async checkWithRateLimit(
    email: string,
    method: "dns" | "smtp" = "dns"
  ): Promise<boolean> {
    const domain = email.split("@")[1];
    const now = Date.now();

    // Skip if domain is known to be blocking
    if (this.blockedDomains.has(domain)) {
      return false;
    }

    // Check if we need to wait
    const lastCheck = this.lastCheck.get(domain) || 0;
    const failCount = this.failCount.get(domain) || 0;

    // Exponential backoff based on failures (max 30 seconds)
    const minDelay = Math.min(30000, 1000 * Math.pow(2, failCount));
    const timeSinceLastCheck = now - lastCheck;

    if (timeSinceLastCheck < minDelay) {
      const waitTime = minDelay - timeSinceLastCheck;
      console.log(`Rate limiting: waiting ${waitTime}ms for ${domain}`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastCheck.set(domain, Date.now());

    try {
      let result: boolean;

      if (method === "dns") {
        result = await this.validateEmailDNS(email);
      } else {
        result = await this.checkEmailSMTPStealth(email);
      }

      if (result) {
        // Reset failure count on success
        this.failCount.delete(domain);
      } else {
        // Increment failure count
        const newFailCount = failCount + 1;
        this.failCount.set(domain, newFailCount);

        // Block domain if too many failures
        if (newFailCount >= 5) {
          console.log(`Blocking domain ${domain} due to repeated failures`);
          this.blockedDomains.add(domain);
        }
      }

      return result;
    } catch (error) {
      console.log(`Error checking ${email}:`, error);
      this.failCount.set(domain, failCount + 1);
      return false;
    }
  }

  private async validateEmailDNS(email: string): Promise<boolean> {
    try {
      const domain = email.split("@")[1];

      // Check MX records
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords.length) return false;

      // Optional: Also check if domain has A record
      try {
        await dns.resolve4(domain);
        return true;
      } catch {
        // Domain might only have MX records, that's still valid
        return mxRecords.length > 0;
      }
    } catch {
      return false;
    }
  }

  private async checkEmailSMTPStealth(email: string): Promise<boolean> {
    try {
      const domain = email.split("@")[1];
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords.length) return false;

      // Use random MX server to avoid patterns
      const randomMX = mxRecords[Math.floor(Math.random() * mxRecords.length)];

      // Generate random client hostname
      const randomHostname = `mail-${randomBytes(4).toString("hex")}.${domain}`;

      const connection = new SMTPConnection({
        host: randomMX.exchange,
        port: 25,
        secure: false,
        tls: { rejectUnauthorized: false },
        socketTimeout: 10000,
        greetingTimeout: 10000,
        name: randomHostname,
        // Add some randomization to connection timing
        connectionTimeout: 8000 + Math.random() * 4000,
      });

      return await new Promise((resolve) => {
        let resolved = false;

        const cleanup = () => {
          if (!resolved) {
            resolved = true;
            try {
              connection.quit();
            } catch {}
          }
        };

        // Overall timeout
        const timeout = setTimeout(() => {
          cleanup();
          resolve(false);
        }, 15000);

        connection.connect(() => {
          try {
            // Use RCPT TO command instead of sending full message
            connection._socket.write(`HELO ${randomHostname}\r\n`);
            connection._socket.write(`MAIL FROM:<noreply@${domain}>\r\n`);
            connection._socket.write(`RCPT TO:<${email}>\r\n`);

            let response = "";
            let commandsSent = 0;

            connection._socket.on("data", (data: Buffer) => {
              response += data.toString();
              const lines = response.split("\r\n");

              for (const line of lines) {
                if (line.startsWith("250") && commandsSent === 2) {
                  // 250 response to RCPT TO means email exists
                  clearTimeout(timeout);
                  cleanup();
                  resolve(true);
                  return;
                } else if (
                  line.startsWith("550") ||
                  line.startsWith("551") ||
                  line.startsWith("553") ||
                  line.startsWith("554")
                ) {
                  // These codes typically mean email doesn't exist
                  clearTimeout(timeout);
                  cleanup();
                  resolve(false);
                  return;
                } else if (line.startsWith("250")) {
                  commandsSent++;
                }
              }
            });
          } catch (err) {
            clearTimeout(timeout);
            cleanup();
            resolve(false);
          }
        });

        connection.on("error", (err: any) => {
          console.log(`SMTP error for ${email}:`, err.message);
          clearTimeout(timeout);
          cleanup();
          resolve(false);
        });
      });
    } catch (err) {
      console.log(`SMTP check failed for ${email}:`, err);
      return false;
    }
  }
}

// Clean and normalize names
function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

// Generate smart email guesses ordered by likelihood
function generateSmartGuesses(name: string, domain: string): string[] {
  const normalized = normalize(name);
  const parts = normalized.split(" ");

  if (parts.length < 2) return [];

  const [first, ...lastParts] = parts;
  const last = lastParts.join(""); // Handle multiple last names

  // Order by most common corporate email patterns
  const patterns = [
    // Most common patterns first
    `${first}.${last}`, // john.doe (most common)
    `${first}${last}`, // johndoe
    `${first.charAt(0)}${last}`, // jdoe
    `${first}`, // john
    `${first}.${last.charAt(0)}`, // john.d
    `${first.charAt(0)}.${last}`, // j.doe
    `${last}.${first}`, // doe.john
    `${last}${first}`, // doejohn

    // Less common patterns
    `${first}_${last}`, // john_doe
    `${first}-${last}`, // john-doe
    `${last}`, // doe
    `${first.charAt(0)}${last.charAt(0)}`, // jd

    // Variations with numbers (common in larger companies)
    `${first}.${last}1`, // john.doe1
    `${first}${last}1`, // johndoe1
    `${first.charAt(0)}${last}1`, // jdoe1
  ];

  // Remove duplicates and return as email addresses
  return [...new Set(patterns)].map((pattern) => `${pattern}@${domain}`);
}

// Multi-method email validation
async function validateEmailMultiMethod(
  email: string,
  checker: EmailChecker
): Promise<{
  valid: boolean;
  method: string;
  confidence: number;
}> {
  // Method 1: Basic format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, method: "format", confidence: 100 };
  }

  // Method 2: DNS/MX validation (fast and less intrusive)
  try {
    const dnsValid = await checker.checkWithRateLimit(email, "dns");
    if (!dnsValid) {
      return { valid: false, method: "dns", confidence: 90 };
    }

    // For most cases, DNS validation is sufficient
    // Only use SMTP for critical validations or when specifically requested
    return { valid: true, method: "dns", confidence: 85 };
  } catch (error) {
    console.log(`DNS validation failed for ${email}:`, error);
    return { valid: false, method: "dns-error", confidence: 80 };
  }
}

// Initialize the email checker
const emailChecker = new EmailChecker();

// POST handler
export async function POST(req: NextRequest) {
  try {
    const { name, domain, useSMTP = false } = await req.json();

    if (!name || !domain) {
      return NextResponse.json(
        { success: false, message: "Missing name or domain" },
        { status: 400 }
      );
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { success: false, message: "Invalid domain format" },
        { status: 400 }
      );
    }

    console.log(`Starting email search for: ${name} at ${domain}`);

    const guesses = generateSmartGuesses(name, domain);
    const results: Array<{
      email: string;
      valid: boolean;
      method: string;
      confidence: number;
    }> = [];

    console.log(`Generated ${guesses.length} email patterns to check`);

    for (let i = 0; i < guesses.length; i++) {
      const guess = guesses[i];
      console.log(`Checking ${i + 1}/${guesses.length}: ${guess}`);

      const validation = await validateEmailMultiMethod(guess, emailChecker);
      results.push({
        email: guess,
        valid: validation.valid,
        method: validation.method,
        confidence: validation.confidence,
      });

      if (validation.valid) {
        console.log(
          `✓ Found valid email: ${guess} (${validation.method}, ${validation.confidence}% confidence)`
        );
        return NextResponse.json({
          success: true,
          email: guess,
          method: validation.method,
          confidence: validation.confidence,
          message: "Valid email found",
          checkedCount: i + 1,
          totalPatterns: guesses.length,
        });
      }

      // Add delay between checks to avoid being flagged as spam
      if (i < guesses.length - 1) {
        const delay = 500 + Math.random() * 1000; // 0.5-1.5s random delay
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.log(
      `No valid emails found after checking ${results.length} patterns`
    );

    return NextResponse.json({
      success: false,
      message: "No valid email found",
      checkedEmails: results.map((r) => ({
        email: r.email,
        method: r.method,
        confidence: r.confidence,
      })),
      totalChecked: results.length,
      suggestions:
        results.length > 0
          ? [
              "Try different name variations",
              "Check if the domain accepts emails",
              "Verify the person works at this company",
            ]
          : [],
    });
  } catch (err: any) {
    console.error("Error in email guessing:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
