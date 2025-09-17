"use client";

import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import React from "react";

interface SignInButtonProps {
  isConnected: boolean;
  className?: string;
}

export default function SignInButton({
  isConnected,
  className,
}: SignInButtonProps) {
  console.log(isConnected)
  if (isConnected) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 font-medium text-emerald-600">
        <CheckCircle className="h-5 w-5" />
        <span>GitHub Connected</span>
      </div>
    );
  }

  return (
    <a
      href="/api/auth/github"
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-2",
        className
      )}
    >
      Link your GitHub
    </a>
  );
}
