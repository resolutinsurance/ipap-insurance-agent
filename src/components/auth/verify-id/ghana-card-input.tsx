"use client";

import { Input } from "@/components/ui/input";

interface VerifyIdGhanaCardInputProps {
  ghanaCardNumber: string;
  onGhanaCardNumberChange: (value: string) => void;
}

export const VerifyIdGhanaCardInput = ({
  ghanaCardNumber,
  onGhanaCardNumberChange,
}: VerifyIdGhanaCardInputProps) => {
  return (
    <div className="mb-6 space-y-2">
      <label
        htmlFor="ghanaCardNumber"
        className="text-sm font-medium text-gray-700"
      >
        Ghana Card Number
      </label>
      <Input
        id="ghanaCardNumber"
        value={ghanaCardNumber}
        onChange={(e) => onGhanaCardNumberChange(e.target.value)}
        placeholder="GHA-XXXXXXXXX"
      />
      <p className="text-xs text-gray-500">
        If the saved number is incorrect, update it here. It must start with
        &quot;GHA&quot;.
      </p>
    </div>
  );
};
