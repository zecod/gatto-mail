import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

// @ts-expect-error: No type definitions for smtp-connection
import SMTPConnection from "smtp-connection";

// Clean and normalize names
function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

// Generate guess patterns from name and domain
function generateGuesses(name: string, domain: string): string[] {
  const parts = normalize(name).split(" ");

  if (parts.length < 2) return [];

  const firstParts = parts.slice(0, Math.ceil(parts.length / 2));
  const lastParts = parts.slice(Math.ceil(parts.length / 2));

  const guesses = new Set<string>();

  for (const first of firstParts) {
    for (const last of lastParts) {
      guesses.add(`${first}@${domain}`);
      guesses.add(`${last}@${domain}`);
      guesses.add(`${first}.${last}@${domain}`);
      guesses.add(`${last}.${first}@${domain}`);
      guesses.add(`${first}${last}@${domain}`);
      guesses.add(`${last}${first}@${domain}`);
      guesses.add(`${first.charAt(0)}${last}@${domain}`);
      guesses.add(`${first.charAt(0)}.${last}@${domain}`);
      guesses.add(`${first.charAt(0)}${last.charAt(0)}@${domain}`);
    }
  }

  return Array.from(guesses);
}

// Check if email is valid via SMTP
async function checkEmailSMTP(email: string): Promise<boolean> {
  try {
    const domain = email.split("@")[1];
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords.length) return false;

    mxRecords.sort((a, b) => a.priority - b.priority);
    const mxHost = mxRecords[0].exchange;

    const connection = new SMTPConnection({
      host: mxHost,
      port: 25,
      secure: false,
      tls: { rejectUnauthorized: false },
      socketTimeout: 5000,
      greetingTimeout: 5000,
    });

    console.log(domain);

    return await new Promise((resolve) => {
      connection.connect(() => {
        connection.send(
          { from: `test@suonora.com`, to: [email] },
          "Test message\n",
          (err: any) => {
            connection.quit();
            if (err?.message.includes("550")) return resolve(false);
            resolve(!err);
          }
        );
      });

      connection.on("error", () => resolve(false));
    });
  } catch {
    return false;
  }
}

// POST handler
export async function POST(req: NextRequest) {
  try {
    const { name, domain } = await req.json();

    if (!name || !domain) {
      return NextResponse.json(
        { success: false, message: "Missing name or domain" },
        { status: 400 }
      );
    }

    const guesses = generateGuesses(name, domain);

    for (const guess of guesses) {
      const isValid = await checkEmailSMTP(guess);
      if (isValid) {
        return NextResponse.json({
          success: true,
          email: guess,
          message: "ok",
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: "No valid email found",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
