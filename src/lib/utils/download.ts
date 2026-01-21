/**
 * Download a Blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a filename with date suffix
 */
export function generateFilenameWithDate(
  prefix: string,
  extension: string = "pdf"
): string {
  const date = new Date().toISOString().split("T")[0];
  return `${prefix}-${date}.${extension}`;
}
