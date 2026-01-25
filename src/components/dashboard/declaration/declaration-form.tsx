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
import { convertBase64ToFile } from "@/lib/utils/file-utils";
import React from "react";
import { toast } from "sonner";

interface DeclarationFormProps {
  onSuccess: (signatureFilename?: string) => void | Promise<void>;
  onCancel: () => void;
  skipQuoteUpdate?: boolean;
  updateVerificationState?: (updates: {
    declarations?: {
      termsAndConditions: boolean;
      dataProcessing: boolean;
      insuranceTerms: boolean;
      premiumPayment: boolean;
      policyValidity: boolean;
    };
    signatureFilename?: string | undefined;
  }) => Promise<void>;
  initialDeclarations?: {
    termsAndConditions: boolean;
    dataProcessing: boolean;
    insuranceTerms: boolean;
    premiumPayment: boolean;
    policyValidity: boolean;
  };
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

    // Get signature data - prioritize current signature from component, but fall back to initialSignature if available
    let signature = currentSignature;

    // If no signature from component, check if we have a saved signature
    if (!signature && initialSignature) {
      signature = initialSignature;
    }

    if (!signature) {
      toast.error("Please provide a signature to continue");
      return;
    }

    // Start loading immediately before any async operations
    setIsSubmitting(true);

    try {
      // Convert signature to File if it's a base64 string (from signature pad)
      let signatureFile: File;
      if (signature instanceof File) {
        signatureFile = signature;
      } else {
        // Convert base64 string (SVG from pad) to File
        signatureFile = convertBase64ToFile(signature, "signature");
      }

      // Upload signature file to API
      const uploadResponse = await uploadFileMutation.mutateAsync(signatureFile);

      // Extract originalname from API response
      const signatureFilename = uploadResponse.message[0]?.originalname;

      if (!signatureFilename) {
        throw new Error("Failed to get filename from upload response");
      }

      // Now save the signature filename to state (only when Continue is pressed)
      if (updateVerificationState) {
        await updateVerificationState({ signatureFilename });
      }

      toast.success("Declaration accepted successfully");
      // Pass the filename to onSuccess and await it to ensure parent's async operations complete
      await onSuccess(signatureFilename);
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
          <div className="flex items-start space-x-3">
            <Checkbox
              id="termsAndConditions"
              checked={declarations.termsAndConditions}
              onCheckedChange={(checked) =>
                handleDeclarationChange("termsAndConditions", checked as boolean)
              }
            />
            <Label htmlFor="termsAndConditions" className="text-sm">
              I have read and understood the premium financing (loan) terms and conditions.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="dataProcessing"
              checked={declarations.dataProcessing}
              onCheckedChange={(checked) =>
                handleDeclarationChange("dataProcessing", checked as boolean)
              }
            />
            <Label htmlFor="dataProcessing" className="text-sm">
              I consent to the processing of my personal data for loan administration,
              verification, and payment processing.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="insuranceTerms"
              checked={declarations.insuranceTerms}
              onCheckedChange={(checked) =>
                handleDeclarationChange("insuranceTerms", checked as boolean)
              }
            />
            <Label htmlFor="insuranceTerms" className="text-sm">
              I understand this is a loan to finance my insurance premium, and that the
              insurance policy terms are separate from this loan agreement.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="premiumPayment"
              checked={declarations.premiumPayment}
              onCheckedChange={(checked) =>
                handleDeclarationChange("premiumPayment", checked as boolean)
              }
            />
            <Label htmlFor="premiumPayment" className="text-sm">
              I authorize payment of the insurance premium and I agree to repay the loan
              according to the repayment schedule.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="policyValidity"
              checked={declarations.policyValidity}
              onCheckedChange={(checked) =>
                handleDeclarationChange("policyValidity", checked as boolean)
              }
            />
            <Label htmlFor="policyValidity" className="text-sm">
              I confirm that the information provided for this premium financing request
              is accurate and complete.
            </Label>
          </div>
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
