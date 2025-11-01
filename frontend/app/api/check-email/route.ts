import { NextRequest, NextResponse } from "next/server";
import { checkEmailSMTP } from "@/lib/checkEmailSMTP";
import { isRateLimited } from "@/lib/rate-limiter";


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
