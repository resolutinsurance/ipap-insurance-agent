import { downloadBlob, generateFilenameWithDate } from "@/lib/utils/download";
import { useMutation } from "@tanstack/react-query";

/**
 * Encode data as base64 for URL
 */
function encodeData(data: unknown): string {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

type GeneratePDFOptions = {
  /** Base URL to the preview page */
  url: string;
  /** Data to pass to the preview page (encoded as base64 in URL) */
  params?: unknown;
  /** Authorization token for authenticated preview pages */
  authorization?: string;
};

/**
 * Hook for generating PDF with flexible options
 */
export default function useGeneratePDF() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (options: GeneratePDFOptions) => {
      const urlObj = new URL(options.url);

      // Encode data in URL if provided
      if (options.params !== undefined) {
        urlObj.searchParams.set("data", encodeData(options.params));
      }

      // Add authorization token if provided
      if (options.authorization) {
        urlObj.searchParams.set("authorization", options.authorization);
      }

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlObj.toString() }),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Failed to generate PDF" }));
        throw new Error(error.error || "Failed to generate PDF");
      }

      return response.blob();
    },
  });

  /**
   * Generate PDF and download it (with data encoded in URL)
   */
  async function generateAndDownload(
    url: string,
    filename: string,
    data: unknown
  ): Promise<void> {
    const blob = await mutateAsync({ url, params: data });
    downloadBlob(blob, filename);
  }

  /**
   * Generate PDF with full options and download it
   */
  async function generateWithOptions(
    options: GeneratePDFOptions & { filename: string }
  ): Promise<void> {
    const { filename, ...pdfOptions } = options;
    const blob = await mutateAsync(pdfOptions);
    downloadBlob(blob, filename);
  }

  /**
   * Convert Blob to File object for FormData upload
   */
  function blobToFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: "application/pdf" });
  }

  return {
    generating: isPending,
    generatePDF: mutateAsync,
    generateAndDownload,
    generateWithOptions,
    blobToFile,
    downloadBlob,
    generateFilenameWithDate,
  };
}
