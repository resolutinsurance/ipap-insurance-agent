"use client";

import {
  CameraInput,
  StartVerification,
  VerificationResult,
} from "@/components/ghana/verification-shared";
import ReviewImageModal from "@/components/modals/review-image-modal";
import { Card, CardContent } from "@/components/ui/card";
import WidthConstraint from "@/components/ui/width-constraint";
import { useAuth } from "@/hooks/use-auth";
import { useCamera } from "@/hooks/use-camera";
import { useVerificationFlow } from "@/hooks/use-verification-flow";
import { ROUTES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { VerifyIdGhanaCardInput } from "./ghana-card-input";
import { VerifyIdHeader } from "./header";

export const VerifyIdForm = () => {
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
      <VerifyIdHeader currentStep={currentStep} />
      <WidthConstraint className="flex-1 w-full h-full">
        <Card className="w-full border-none rounded-none h-full bg-transparent shadow-none px-0">
          <CardContent className="max-w-md lg:max-w-lg mx-auto h-full">
            <VerifyIdGhanaCardInput
              ghanaCardNumber={ghanaCardNumber}
              onGhanaCardNumberChange={setGhanaCardNumber}
            />
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

      <ReviewImageModal
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        capturedImage={capturedImage}
        retakeImage={retakeImage}
        confirmImage={confirmImage}
        isVerifying={isVerifying}
        isPending={isPending}
      />
    </section>
  );
};
