"use client";

import {
  CameraInput,
  StartVerification,
  VerificationResult,
} from "@/components/ghana/verification-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import WidthConstraint from "@/components/ui/width-constraint";
import { useAuth } from "@/hooks/use-auth";
import { useCamera } from "@/hooks/use-camera";
import { VERIFICATION_STEPS, useVerificationFlow } from "@/hooks/use-verification-flow";
import { ROUTES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userType, getUserProfile } = useAuth();
  const { videoRef, canvasRef, startCamera, stopCamera, captureSelfie } = useCamera();

  const verificationFlow = useVerificationFlow({
    userEmail: user?.email || "",
    userPhone: user?.phone || "",
    onSuccess: async () => {
      // Backend handles user update, so we just refetch user data
      if (user?.id) {
        try {
          await getUserProfile.mutateAsync(user.id);
        } catch (refetchError) {
          console.error("Failed to refetch user profile:", refetchError);
          // Don't fail the verification if refetch fails
        }
      }

      // Check for redirect URL in query params, otherwise go to customer home
      const redirectUrl = searchParams.get("redirect") || searchParams.get("next");
      const finalRedirect = redirectUrl || ROUTES.AGENT.HOME;

      // Use window.location.href for full page reload to ensure middleware handles the redirect properly
      setTimeout(() => {
        window.location.href = finalRedirect;
      }, 1000); // Small delay to show success message
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
    if (!user) {
      toast.error("Please sign in to continue");
      router.push(ROUTES.LOGIN);
      return;
    }
    if (user?.GhcardNo) {
      setGhanaCardNumber(user.GhcardNo);
    }
  }, [user, userType, router, setGhanaCardNumber]);

  const handleStartVerification = () => {
    flowHandleStartVerification();
    startCamera();
  };

  const handlePrevious = () => {
    flowHandlePrevious(stopCamera, startCamera);
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

  const handleNext = () => {
    // Only proceed if verification was actually successful
    // The redirect happens automatically in onSuccess callback, but add safeguard
    if (isVerificationSuccessful === true) {
      // Redirect is handled by onSuccess callback in useVerificationFlow
      // This is just a safeguard in case the button is clicked
      return;
    } else {
      toast.error("Verification must be successful to proceed");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${
                        step < currentStep ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {VERIFICATION_STEPS[currentStep - 1].title}
            </h1>
            <p className="text-gray-600 text-sm">
              {VERIFICATION_STEPS[currentStep - 1].description}
            </p>
          </div>
        </div>
      </header>
      <WidthConstraint className="flex-1 w-full h-full">
        <Card className="w-full border-none rounded-none h-full bg-transparent shadow-none px-0">
          <CardContent className="max-w-md lg:max-w-lg mx-auto h-full">
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
                onChange={(e) => setGhanaCardNumber(e.target.value)}
                placeholder="GHA-XXXXXXXXX"
              />
              <p className="text-xs text-gray-500">
                If the saved number is incorrect, update it here. It must start with
                &quot;GHA&quot;.
              </p>
            </div>
            {currentStep === 1 && (
              <StartVerification handleStartVerification={handleStartVerification} />
            )}

            {currentStep === 2 && (
              <CameraInput
                videoRef={videoRef}
                canvasRef={canvasRef}
                captureSelfie={captureSelfieHandler}
                handlePrevious={handlePrevious}
              />
            )}

            {currentStep === 3 && (
              <VerificationResult
                isVerificationSuccessful={isVerificationSuccessful ?? false}
                handleRetry={handleRetry}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
              />
            )}
          </CardContent>
        </Card>
      </WidthConstraint>

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
              onClick={confirmImage}
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
    </section>
  );
};

export default Page;
