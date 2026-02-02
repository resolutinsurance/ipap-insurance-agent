"use client";

import {
  CameraInput,
  StartVerification,
  VerificationResult,
} from "@/components/ghana/verification-shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCamera } from "@/hooks/use-camera";
import { useVerificationFlow } from "@/hooks/use-verification-flow";
import {
  MainUserGhanaCardVerificationResponse,
  PublicGhanaCardVerificationResponse,
} from "@/lib/interfaces/response";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface GhanaCardVerificationStepProps {
  userEmail: string;
  userPhone: string;
  ghanaCardNumber?: string | null;
  verificationId?: string;
  ghanaCardResponse?:
    | PublicGhanaCardVerificationResponse
    | MainUserGhanaCardVerificationResponse
    | null;
  onSuccess: (
    ghanaCardResponse:
      | PublicGhanaCardVerificationResponse
      | MainUserGhanaCardVerificationResponse
      | null,
    verificationId?: string,
    ghanaCardNumber?: string
  ) => void;
  onCancel?: () => void;
}

export const GhanaCardVerificationStep = ({
  userEmail,
  userPhone,
  ghanaCardNumber: initialGhanaCardNumber,
  verificationId,
  ghanaCardResponse,
  onSuccess,
  onCancel,
}: GhanaCardVerificationStepProps) => {
  const { videoRef, canvasRef, startCamera, stopCamera, captureSelfie } = useCamera();
  const ghanaCardNumberRef = useRef<string>("");
  const hasRequiredUserInfo = Boolean(userEmail && userPhone);
  const hasShownMissingInfoToastRef = useRef(false);

  const verificationFlow = useVerificationFlow({
    userEmail,
    userPhone,
    usePublicVerification: true, // Use public verification for payments (not user-specific)
    onSuccess: (verificationId, ghanaCardNumber, ghanaCardResponse) => {
      const ghCardRes = ghanaCardResponse ?? null;
      // Pass verification ID, Ghana card number, and full response to parent component
      onSuccess(ghCardRes, verificationId, ghanaCardNumber);
    },
  });

  const {
    currentStep,
    isVerificationSuccessful,
    capturedImage,
    showImageModal,
    setShowImageModal,
    isVerifying,
    ghanaCardNumber,
    setGhanaCardNumber,
    handleStartVerification: flowHandleStartVerification,
    handlePrevious: flowHandlePrevious,
    handleRetry: flowHandleRetry,
    handleCapture,
    retakeImage: flowRetakeImage,
    confirmImage,
    isPending,
  } = verificationFlow;

  useEffect(() => {
    if (!hasRequiredUserInfo && !hasShownMissingInfoToastRef.current) {
      hasShownMissingInfoToastRef.current = true;
      toast.error("User email and phone are required, please contact support");
    }
  }, [hasRequiredUserInfo]);

  // Update ref whenever ghanaCardNumber changes
  useEffect(() => {
    ghanaCardNumberRef.current = ghanaCardNumber;
  }, [ghanaCardNumber]);

  // Set initial Ghana card number if provided
  useEffect(() => {
    if (initialGhanaCardNumber) {
      setGhanaCardNumber(initialGhanaCardNumber);
      ghanaCardNumberRef.current = initialGhanaCardNumber;
    }
  }, [initialGhanaCardNumber, setGhanaCardNumber]);

  const handleStartVerification = () => {
    flowHandleStartVerification();
    startCamera();
  };

  const handlePrevious = () => {
    flowHandlePrevious(stopCamera, startCamera);
    if (currentStep === 1 && onCancel) {
      onCancel();
    }
  };

  const handleRetry = () => {
    flowHandleRetry(startCamera);
  };

  const captureSelfieHandler = () => {
    const imageData = captureSelfie();
    if (imageData) {
      handleCapture(imageData);
    }
  };

  const retakeImage = () => {
    flowRetakeImage(startCamera);
  };

  const handleConfirmImage = async () => {
    if (!ghanaCardNumber || ghanaCardNumber.trim() === "") {
      toast.error("Ghana Card number is required");
      return;
    }
    await confirmImage();
  };

  if (!hasRequiredUserInfo) {
    return null;
  }

  const isAlreadyVerified = Boolean(verificationId && ghanaCardResponse);

  // If already verified (e.g., restored from sessionStorage), skip the camera flow entirely.
  // Show the same success UI and allow user to continue immediately.
  if (isAlreadyVerified) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="ghanaCardNumber" className="text-sm font-medium text-gray-700">
            Ghana Card Number
          </label>
          <Input
            id="ghanaCardNumber"
            value={ghanaCardNumber}
            onChange={(e) => setGhanaCardNumber(e.target.value)}
            placeholder="GHA-XXXXXXXXX"
          />
          <p className="text-xs text-gray-500">
            You&apos;re already verified for this session. If the number is incorrect, you
            can update it and redo verification.
          </p>
        </div>

        <VerificationResult
          isVerificationSuccessful={true}
          handleRetry={() => {
            // User wants to redo verification; go back (parent can decide next step)
            if (onCancel) onCancel();
          }}
          handleNext={() => {
            onSuccess(ghanaCardResponse ?? null, verificationId, ghanaCardNumber);
          }}
          handlePrevious={() => {
            if (onCancel) onCancel();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="ghanaCardNumber" className="text-sm font-medium text-gray-700">
          Ghana Card Number
        </label>
        <Input
          id="ghanaCardNumber"
          value={ghanaCardNumber}
          onChange={(e) => setGhanaCardNumber(e.target.value)}
          placeholder="GHA-XXXXXXXXX"
        />
        <p className="text-xs text-gray-500">
          {initialGhanaCardNumber
            ? "If the saved number is incorrect, update it here. It must start with 'GHA'."
            : "Enter your Ghana Card number. It must start with 'GHA'."}
        </p>
      </div>

      {/* Step 1: Start Verification */}
      {currentStep === 1 && (
        <StartVerification handleStartVerification={handleStartVerification} />
      )}

      {/* Step 2: Camera Input */}
      {currentStep === 2 && (
        <CameraInput
          videoRef={videoRef}
          canvasRef={canvasRef}
          captureSelfie={captureSelfieHandler}
          handlePrevious={handlePrevious}
        />
      )}

      {/* Step 3: Result */}
      {currentStep === 3 && (
        <VerificationResult
          isVerificationSuccessful={isVerificationSuccessful ?? false}
          handleRetry={handleRetry}
          handleNext={() => {
            // Only call onSuccess if verification was actually successful
            if (isVerificationSuccessful === true) {
              const ghanaCardResponse = verificationFlow.ghanaCardResponse ?? null;
              onSuccess(
                ghanaCardResponse,
                verificationFlow.verificationId,
                ghanaCardNumber
              );
            } else {
              // This shouldn't happen due to UI logic, but add safeguard
              toast.error("Verification must be successful to proceed");
            }
          }}
          handlePrevious={handlePrevious}
        />
      )}

      {/* Image Preview Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Your Photo</DialogTitle>
            <DialogDescription>
              Please review your captured image. If you&apos;re satisfied, click &quot;Use
              This Photo&quot; to proceed with verification.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            {capturedImage && (
              <Image
                src={capturedImage}
                alt="Captured selfie"
                className="w-full max-w-sm border rounded-lg"
                width={200}
                height={200}
              />
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={retakeImage}
              className="flex-1"
              disabled={isVerifying || isPending}
            >
              Retake Photo
            </Button>
            <Button
              onClick={handleConfirmImage}
              className="flex-1"
              disabled={isVerifying || isPending}
            >
              {isVerifying || isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Use This Photo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
