import { uploadMultipleFiles, uploadSingleFile } from "@/lib/services/misc";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook for uploading a single file
 * @returns Mutation object with uploadSingleFile function
 */
export const useUploadSingleFile = () => {
  return useMutation({
    mutationFn: (file: File) => uploadSingleFile(file),
  });
};

/**
 * Hook for uploading multiple files (max 6)
 * @returns Mutation object with uploadMultipleFiles function
 */
export const useUploadMultipleFiles = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadMultipleFiles(files),
  });
};
