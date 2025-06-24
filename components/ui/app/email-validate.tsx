"use client";

import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../button";
import { Badge } from "../badge";
import { Loader2, User, BadgeCheck, X } from "lucide-react";
import {
  ApiResponse,
  EmailCheckResult,
  EmailVerificationProps,
} from "./email-finder";

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
const HomeEmailValidate: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Valida l'email con una regex base
  const validateEmail = useCallback(() => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  }, [email]);

  const handleEmailCheck = useCallback(async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`/api/validate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      if (data.success && data.email) {
        setResult({
          fullName: "",
          email: data.email,
          domain: "",
        });
      } else {
        setError(data.message || "Failed to verify email");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Email check failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [email, validateEmail]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !isButtonDisabled) {
      handleEmailCheck();
    }
  };

  const isButtonDisabled = isLoading || !validateEmail();

  return (
    <div className="max-w-[480px] mx-auto mt-5 p-4 space-y-6">
      <div className="flex items-center h-14 border rounded-xl overflow-hidden">
        <Input
          type="email"
          placeholder="yassine@suonora.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          className="rounded-none h-full !bg-transparent border-none focus-visible:ring-0 outline-none"
          aria-label="Email"
        />
        <Button
          onClick={handleEmailCheck}
          disabled={isButtonDisabled}
          className="h-full px-6 rounded-none border-none min-w-18"
          aria-label="Validate email"
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Validate"
          )}
        </Button>
      </div>

      <p className="text-xs text-center my-4 text-accent-foreground/60">
        Check if the email is valid and can receive emails.
      </p>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-none">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="border rounded-lg p-6">
          <EmailVerificationCard email={result.email} isVerified={true} />
        </div>
      )}
    </div>
  );
};

export default HomeEmailValidate;
