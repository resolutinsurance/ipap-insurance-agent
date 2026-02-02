/**
 * Converts an image File to a base64 data URL
 * while preserving the correct MIME type.
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string); // data:image/...;base64
    };

    reader.onerror = () => {
      reject(new Error("Failed to convert file to base64"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Converts a base64 string (data URL or raw base64)
 * back to an image File without breaking it.
 */
export function convertBase64ToFile(base64String: string, fileName = "image"): File {
  if (!base64String) {
    throw new Error("Empty base64 string");
  }

  let mimeType = "image/png";
  let base64Data = base64String;

  // Extract MIME type and base64 data
  if (base64String.startsWith("data:")) {
    const [meta, data] = base64String.split(",");
    const match = meta.match(/data:(.*?);base64/);
    if (match) mimeType = match[1];
    base64Data = data;
  }

  // Correct MIME → extension mapping
  const extensionMap: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };

  const extension = extensionMap[mimeType] ?? "bin";
  const finalFileName = fileName.replace(/\.[^/.]+$/, "") + `.${extension}`;

  try {
    // ✅ SVG must be handled as text
    if (mimeType === "image/svg+xml") {
      const svgText = atob(base64Data);
      return new File([svgText], finalFileName, { type: mimeType });
    }

    // ✅ Binary images
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new File([bytes], finalFileName, { type: mimeType });
  } catch (error) {
    console.error("convertBase64ToFile failed:", error);
    throw error; // fail loudly instead of creating broken files
  }
}

export const isDocumentFile = (file: File | string) => {
  if (file instanceof File) {
    return (
      file.type.includes("pdf") ||
      file.type.includes("msword") ||
      file.type.includes("wordprocessingml")
    );
  }
  return (
    file.toLowerCase().endsWith(".pdf") ||
    file.toLowerCase().endsWith(".doc") ||
    file.toLowerCase().endsWith(".docx")
  );
};

export function isDataUrl(value: string) {
  return value.startsWith("data:") && value.includes(";base64,");
}

export function extractFilename(value: string) {
  // Supports full URLs and simple paths/filenames.
  const withoutQuery = value.split("?")[0]?.split("#")[0] ?? value;
  const lastSegment = withoutQuery.split("/").filter(Boolean).pop();
  return lastSegment ?? null;
}
