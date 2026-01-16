import { COOKIE_KEYS } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

/**
 * Hook for generating PDF blobs (without downloading)
 * Similar to usePagePDFExport but returns the blob instead of triggering download
 */
export default function useGeneratePDF() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: {
      /** Full url to the page to be exported as PDF. */
      url: string;
      /** Optional query parameters to add to the URL */
      params?: Record<string, string>;
    }) => {
      // Get the current access token from cookies
      const cookieName = COOKIE_KEYS.accessToken;
      const accessToken: string | undefined = cookieName
        ? Cookies.get(cookieName)
        : undefined;

      console.log("accessToken", accessToken);

      // Add authorization query parameter to the URL if token exists
      let urlWithAuth = data.url;
      if (accessToken) {
        const urlObj = new URL(data.url);
        urlObj.searchParams.set("authorization", accessToken);
        urlWithAuth = urlObj.toString();
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers,
        body: JSON.stringify({
          url: urlWithAuth,
          params: data.params,
        }),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Failed to generate PDF" }));
        throw new Error(error.error || "Failed to generate PDF");
      }

      const blob = await response.blob();
      return blob as Blob;
    },
  });

  /**
   * Convert Blob to File object for FormData upload
   * Automatically truncates filename to 100 characters max
   */
  function blobToFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: "application/pdf" });
  }

  return {
    generating: isPending,
    generatePDF: mutateAsync,
    blobToFile,
  };
}
