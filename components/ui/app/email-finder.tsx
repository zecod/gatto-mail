"use client";

import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../button";
import { Badge } from "../badge";
import { Loader2, User, BadgeCheck, X } from "lucide-react";

// Types
interface EmailCheckResult {
  fullName: string;
  email: string;
  domain: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  email?: string;
}

interface EmailVerificationProps {
  name: string;
  email: string;
  isVerified: boolean;
}

// Components
const EmailVerificationCard: React.FC<EmailVerificationProps> = ({
  name,
  email,
  isVerified,
}) => (
  <div className="flex justify-between items-center gap-4">
    <div className="flex items-center gap-4">
      <div
        className={`rounded-full p-2 w-14 h-14 flex items-center justify-center ${
          isVerified ? "bg-primary/30" : "bg-red-200 dark:bg-red-950"
        }`}
      >
        {isVerified ? (
          <User className="text-primary" />
        ) : (
          <X className="text-red-600" />
        )}
      </div>
      <div className="space-y-1">
        {isVerified ? (
          <>
            <div className="text-muted-foreground/70">{name}</div>
            <div>{email}</div>
          </>
        ) : (
          <div>Not Found!</div>
        )}
      </div>
    </div>
    {isVerified && (
      <Badge
        variant="secondary"
        className="bg-green-200 dark:bg-green-900 text-green-600"
      >
        <BadgeCheck className="w-4 h-4 mr-1" />
        Verified
      </Badge>
    )}
  </div>
);

// Main Component
const HomeEmailFinder: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateInputs = useCallback(() => {
    const trimmedName = fullName.trim();
    const trimmedDomain = domain.trim();

    if (!trimmedName || !trimmedDomain) {
      return false;
    }

    // Basic domain validation
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(trimmedDomain);
  }, [fullName, domain]);

  const handleEmailCheck = useCallback(async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`https://gatto.suonora.com/api/check-email¡`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          domain: domain.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success && data.email) {
        setResult({
          fullName: fullName.trim(),
          email: data.email,
          domain: domain.trim(),
        });
      } else {
        setError(data.message || "Failed to find email");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Email check failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fullName, domain, validateInputs]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !isButtonDisabled) {
      handleEmailCheck();
    }
  };

  const isButtonDisabled = isLoading || !validateInputs();

  return (
    <div className="max-w-[680px] mx-auto mt-10 p-4 space-y-6">
      {/* Email Input Section */}
      <div className="flex items-center h-14 border rounded-none overflow-hidden">
        <Input
          type="text"
          placeholder="e.g., Mario Rosa"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="rounded-none h-full !bg-transparent border-none focus:ring-0"
          aria-label="Full name"
        />
        <div className="h-full w-32 flex items-center justify-center border-x bg-transparent">
          <span className="text-muted-foreground font-mono p-2">@</span>
        </div>
        <Input
          type="text"
          placeholder="suonora.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyPress={handleKeyPress}
          className="rounded-none h-full !bg-transparent border-none focus:ring-0"
          aria-label="Domain"
        />
        <Button
          onClick={handleEmailCheck}
          disabled={isButtonDisabled}
          className="h-full px-6 rounded-none border-none w-18"
          aria-label="Find email"
        >
          {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Find"}
        </Button>
      </div>

      <p className="text-xs text-center my-4 text-accent-foreground/60">
        For better results, use a domain instead of a company name.
      </p>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-none">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="border rounded-lg p-6">
          <EmailVerificationCard
            name={result.fullName}
            email={result.email}
            isVerified={true}
          />
        </div>
      )}
    </div>
  );
};

export default HomeEmailFinder;
