import { toast } from "sonner";

type ApiErrorResponse = {
  data?: {
    message?: string;
    data?: string[];
  };
};

type ApiError = {
  response?: ApiErrorResponse;
  message?: string;
};

/**
 * Extracts a readable error message from an unknown error object.
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage = "An error occurred"
): string => {
  const err = error as ApiError | undefined;
  const apiMessage = err?.response?.data?.message;
  const apiData = err?.response?.data?.data;

  const missing =
    Array.isArray(apiData) && apiData.length > 0 ? ` Missing: ${apiData.join(", ")}` : "";

  if (apiMessage) {
    return `${apiMessage}.${missing}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return err?.message || fallbackMessage;
};

/**
 * Formats and displays API errors consistently across the app.
 * Returns the final message so callers can optionally use it.
 */
export const handleApiError = (
  error: unknown,
  fallbackMessage = "Request failed",
  options?: {
    /**
     * Custom logger for error reporting. Defaults to console.error.
     */
    logger?: (error: unknown, message: string) => void;
  }
) => {
  const extractedMessage = getErrorMessage(error, fallbackMessage);
  const finalMessage =
    extractedMessage === fallbackMessage
      ? `${fallbackMessage}. Please try again.`
      : extractedMessage.includes(fallbackMessage)
      ? extractedMessage
      : `${fallbackMessage}: ${extractedMessage}`;

  if (options?.logger) {
    options.logger(error, finalMessage);
  } else {
    console.error("API error:", error);
  }

  toast.error(finalMessage);

  return finalMessage;
};
