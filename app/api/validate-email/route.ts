import { NextRequest, NextResponse } from "next/server";
import { checkEmailSMTP } from "@/lib/checkEmailSMTP";
import { isRateLimited } from "@/lib/rate-limiter";

// Validate basic email syntax
function isValidEmailSyntax(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid email" },
        { status: 400 }
      );
    }

    // Step 1: Check syntax
    if (!isValidEmailSyntax(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email syntax" },
        { status: 400 }
      );
    }

    // Step 2: Check SMTP deliverability
    const isDeliverable = await checkEmailSMTP(email);

    return NextResponse.json({
      success: true,
      syntax: true,
      deliverable: isDeliverable,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
