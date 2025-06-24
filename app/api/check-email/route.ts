import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";
import net from "net";

// At the top of your API file
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (now - entry.firstRequest > WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Normalize names
function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

// Generate email guess patterns
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

// Raw SMTP check with net.Socket
async function checkEmailSMTP(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  const mxRecords = await dns.resolveMx(domain);
  if (!mxRecords.length) return false;

  mxRecords.sort((a, b) => a.priority - b.priority);
  const mxHost = mxRecords[0].exchange;

  return await new Promise((resolve) => {
    const socket = net.createConnection(25, mxHost, () => {
      let step = 0;
      const commands = [
        `EHLO ${domain}\r\n`,
        `MAIL FROM:<test@${domain}>\r\n`,
        `RCPT TO:<${email}>\r\n`,
        `QUIT\r\n`,
      ];

      socket.setEncoding("utf-8");

      socket.on("data", (data) => {
        if (data.toString().startsWith("550")) {
          socket.end();
          return resolve(false);
        }

        if (step < commands.length) {
          socket.write(commands[step]);
          step++;
        } else {
          socket.end();
          return resolve(true);
        }
      });

      socket.on("error", () => resolve(false));
      socket.setTimeout(5000, () => {
        socket.end();
        return resolve(false);
      });
    });
  });
}

// POST handler
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

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
