"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PremiumShieldTerms } from "@/components/ui/premium-shield-terms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SignaturePad from "@/components/ui/signature-pad";
import { useUploadSingleFile } from "@/hooks/use-file-upload";
import { DECLARATION_ITEMS } from "@/lib/constants";
import { Declaration } from "@/lib/interfaces";
import { PaymentVerificationState } from "@/lib/store/payment-verification";
import { convertBase64ToFile, extractFilename, isDataUrl } from "@/lib/utils/file-utils";
import React from "react";
import { toast } from "sonner";

interface DeclarationFormProps {
  onSuccess: (signatureFilename?: string) => void | Promise<void>;
  onCancel: () => void;
  skipQuoteUpdate?: boolean;
  updateVerificationState?: (updates: Partial<PaymentVerificationState>) => Promise<void>;
  initialDeclarations?: Declaration;
  initialSignature?: File | string;
}

export function DeclarationForm({
  onSuccess,
  onCancel,
  updateVerificationState,
  initialDeclarations,
  initialSignature,
}: DeclarationFormProps) {
  // Initialize declarations from props or quote request
  const [declarations, setDeclarations] = React.useState(
    initialDeclarations || {
      termsAndConditions: false,
      dataProcessing: false,
      insuranceTerms: false,
      premiumPayment: false,
      policyValidity: false,
      createAccount: false,
    }
  );

  // Update declarations when initialDeclarations changes (e.g., on page refresh)
  React.useEffect(() => {
    if (initialDeclarations) {
      setDeclarations(initialDeclarations);
    }
  }, [initialDeclarations]);

  // Signature state - track current signature from SignaturePad component
  const [currentSignature, setCurrentSignature] = React.useState<File | string | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const uploadFileMutation = useUploadSingleFile();

  const handleDeclarationChange = async (
    key: keyof typeof declarations,
    checked: boolean
  ) => {
    const newDeclarations = {
      ...declarations,
      [key]: checked,
    };
    setDeclarations(newDeclarations);

    // Save to Jotai state immediately
    if (updateVerificationState) {
      await updateVerificationState({ declarations: newDeclarations });
    }
  };

  const allDeclarationsAccepted = Object.values(declarations).every(Boolean);

  const handleSubmit = async () => {
    if (!allDeclarationsAccepted) {
      toast.error("Please accept all declarations to continue");
      return;
    }

    const signature: File | string | null = currentSignature ?? initialSignature ?? null;
    if (signature == null) {
      toast.error("Please provide a signature to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      const acceptWithFilename = async (signatureFilename: string) => {
        await updateVerificationState?.({ signatureFilename });
        toast.success("Declaration accepted successfully");
        await onSuccess(signatureFilename);
      };

      const resolveExistingFilename = (sig: string): string | null => {
        if (isDataUrl(sig)) return null;
        return extractFilename(sig);
      };

      // If we already have a stored/remote signature (URL or filename), don't re-upload it.
      if (typeof signature === "string") {
        const existingFilename = resolveExistingFilename(signature);
        if (existingFilename) {
          await acceptWithFilename(existingFilename);
          return;
        }
      }

      const signatureFile =
        signature instanceof File
          ? signature
          : convertBase64ToFile(signature, "signature");

      const uploadResponse = await uploadFileMutation.mutateAsync(signatureFile);
      const uploadedFilename = uploadResponse.message[0]?.originalname;
      if (!uploadedFilename)
        throw new Error("Failed to get filename from upload response");

      await acceptWithFilename(uploadedFilename);
    } catch (error) {
      console.error("Error submitting declaration:", error);
      toast.error("Failed to accept declaration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Declaration & Agreement</h2>
        <p className="text-gray-600 mt-2">
          Please read and accept the following declarations to proceed with your premium
          financing (loan) arrangement.
        </p>
      </div>

      <Card className="border-none shadow-none">
        <CardHeader className="p-0 border-none shadow-none">
          <CardTitle>Loan Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="p-0 border-none shadow-none ">
          <ScrollArea className="h-64 w-full border rounded-md p-4">
            <div className="text-gray-700">
              <PremiumShieldTerms variant="full" />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Declaration Acceptance</h3>
        </div>

        <div className="space-y-3">
          {DECLARATION_ITEMS.map(({ key, label }) => (
            <div key={key} className="flex items-start space-x-3">
              <Checkbox
                id={key}
                checked={declarations[key]}
                onCheckedChange={(checked) =>
                  handleDeclarationChange(key, checked as boolean)
                }
              />
              <Label htmlFor={key} className="text-sm">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Signature Collection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Signature</h3>
        </div>
        <p className="text-sm text-gray-600">
          Please provide your signature using either the signature pad or by uploading a
          signature image
        </p>

        <SignaturePad
          width="100%"
          height={200}
          previewSrc={initialSignature}
          onSignatureChange={setCurrentSignature}
        />
        <p className="text-sm text-gray-500">
          Please start signing from the left hand side of the page.
        </p>
      </div>

      <Separator />

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!allDeclarationsAccepted || isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Accept & Continue"}
        </Button>
      </div>
    </div>
  );
}
