"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  className?: string;
}

export const OTPInput = ({ value, onChange, length = 6, className }: OTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Handle pasting multiple characters
    if (newValue.length > 1) {
      // Clean the input to only include digits
      const digits = newValue.replace(/\D/g, "").split("").slice(0, length);

      // Create a new array with the pasted digits
      const newValues = [...value];
      digits.forEach((digit, i) => {
        if (i < length) {
          newValues[i] = digit;
        }
      });

      // Update the state with all digits
      onChange(newValues);

      // Focus the last input or the next empty input
      const lastFilledIndex = Math.min(digits.length - 1, length - 1);
      const nextEmptyIndex = Math.min(lastFilledIndex + 1, length - 1);
      inputRefs.current[nextEmptyIndex]?.focus();

      return;
    }

    // Handle single character input
    const newValues = [...value];
    newValues[index] = newValue;
    onChange(newValues);

    // Move to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, length);

    // Create a new array with the pasted digits
    const newValues = [...value];
    digits.forEach((digit, i) => {
      if (i < length) {
        newValues[i] = digit;
      }
    });

    // Update the state with all digits
    onChange(newValues);

    // Focus the last input or the next empty input
    const lastFilledIndex = Math.min(digits.length - 1, length - 1);
    const nextEmptyIndex = Math.min(lastFilledIndex + 1, length - 1);
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={setInputRef(index)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`Verification code digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
