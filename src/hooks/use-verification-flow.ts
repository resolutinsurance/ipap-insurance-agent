import { COOKIE_KEYS, COOKIE_OPTIONS } from "@/lib/constants";
import {
  MainUserGhanaCardVerificationResponse,
  PublicGhanaCardVerificationResponse,
} from "@/lib/interfaces/response";
import { base64ToFile, getDeviceOS, normalizeGhanaCardNumber } from "@/lib/utils";
import { getErrorMessage } from "@/lib/utils/api-error";
import Cookies from "js-cookie";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  useGhCardVerification,
  useGhCardVerificationPublic,
} from "./use-gh-card-verification";

export const VERIFICATION_STEPS = [
  { title: "Start Verification", description: "Begin selfie verification process" },
  { title: "Take Selfie", description: "Capture your photo for verification" },
  { title: "Verification Result", description: "View verification results" },
] as const;

interface UseVerificationFlowParams {
  userEmail: string;
  userPhone: string;
  onSuccess?: (
    verificationId?: string,
    ghanaCardNumber?: string,
    ghanaCardResponse?:
      | PublicGhanaCardVerificationResponse
      | MainUserGhanaCardVerificationResponse
  ) => void | Promise<void>;
  onError?: (error: unknown) => void;
  usePublicVerification?: boolean; // Use public verification for payments
}

export const useVerificationFlow = ({
  userEmail,
  userPhone,
  onSuccess,
  onError,
  usePublicVerification = false,
}: UseVerificationFlowParams) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerificationSuccessful, setIsVerificationSuccessful] = useState<
    boolean | null
  >(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [verificationId, setVerificationId] = useState<string | undefined>(undefined);
  const [ghanaCardResponse, setGhanaCardResponse] = useState<
    PublicGhanaCardVerificationResponse | MainUserGhanaCardVerificationResponse | null
  >(null);
  const { verifyGhanaCard } = useGhCardVerification();
  const { verifyGhanaCardPublic } = useGhCardVerificationPublic();

  const handleStartVerification = useCallback(() => {
    setCurrentStep(2);
  }, []);

  const handlePrevious = useCallback(
    (stopCamera: () => void, startCamera: () => void) => {
      if (currentStep > 1) {
        if (currentStep === 2) {
          stopCamera();
        }
        if (currentStep === 3) {
          setCapturedImage(null);
          setCurrentStep(currentStep - 1);
          setTimeout(() => {
            startCamera();
          }, 100);
        } else {
          setCurrentStep(currentStep - 1);
        }
      }
    },
    [currentStep]
  );

  const handleRetry = useCallback((startCamera: () => void) => {
    setCurrentStep(2);
    setIsVerificationSuccessful(null);
    setCapturedImage(null);
    startCamera();
  }, []);

  const handleCapture = useCallback((imageData: string | null) => {
    if (imageData) {
      setCapturedImage(imageData);
      setShowImageModal(true);
    }
  }, []);

  const retakeImage = useCallback((startCamera: () => void) => {
    setShowImageModal(false);
    setCapturedImage(null);
    startCamera();
  }, []);

  const confirmImage = useCallback(async () => {
    if (!capturedImage) {
      toast.error("Missing image");
      return;
    }

    setIsVerifying(true);
    setShowImageModal(true);

    try {
      const normalizedCardNumber = normalizeGhanaCardNumber(ghanaCardNumber || "");
      const imageFile = base64ToFile(capturedImage, "selfie.jpg");

      const verificationData = {
        userEmail,
        phone: userPhone,
        pinNumber: normalizedCardNumber,
        center: "swedru",
        deviceOs: getDeviceOS(),
        image: imageFile,
      };

      const response = usePublicVerification
        ? await verifyGhanaCardPublic.mutateAsync(verificationData)
        : await verifyGhanaCard.mutateAsync(verificationData);

      // Extract the actual response data (could be in response.message or response.data)
      const responseData = response?.message;

      // Store the full response
      setGhanaCardResponse(responseData);

      // Extract verification ID from response (only for public verification)
      if (usePublicVerification) {
        const extractedId = responseData?.id;

        if (extractedId) {
          setVerificationId(extractedId);
        }
      }

      // Only mark as successful if we reach here without throwing an error
      // The mutation will throw if verification fails, so if we're here, it succeeded
      setShowImageModal(false);
      setIsVerificationSuccessful(true);
      setCurrentStep(3);
      toast.success("Verification successful!");
      Cookies.set(COOKIE_KEYS.ghanaVerified, "true", COOKIE_OPTIONS);

      // Pass verification ID, Ghana card number, and full response to onSuccess
      if (usePublicVerification) {
        const extractedId = responseData?.id;
        onSuccess?.(extractedId, ghanaCardNumber, responseData);
      } else {
        onSuccess?.(undefined, ghanaCardNumber, responseData);
      }
    } catch (error) {
      console.error("Verification error:", error);

      const errorMessage = getErrorMessage(
        error,
        "Verification failed. Please ensure your details are correct and try again."
      );

      toast.error(errorMessage);
      setIsVerificationSuccessful(false);
      setCurrentStep(3);
      onError?.(error);
    } finally {
      setShowImageModal(false);
      setIsVerifying(false);
    }
  }, [
    capturedImage,
    ghanaCardNumber,
    userEmail,
    userPhone,
    verifyGhanaCard,
    verifyGhanaCardPublic,
    usePublicVerification,
    onSuccess,
    onError,
  ]);

  return {
    currentStep,
    isVerificationSuccessful,
    capturedImage,
    showImageModal,
    setShowImageModal,
    isVerifying,
    ghanaCardNumber,
    setGhanaCardNumber,
    verificationId: usePublicVerification ? verificationId : undefined,
    ghanaCardResponse,
    handleStartVerification,
    handlePrevious,
    handleRetry,
    handleCapture,
    retakeImage,
    confirmImage,
    isPending: usePublicVerification
      ? verifyGhanaCardPublic.isPending
      : verifyGhanaCard.isPending,
  };
};
