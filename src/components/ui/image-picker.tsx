import { FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ImagePickerProps {
  id: string;
  label: string;
  value: File | string | null;
  src?: string; // URL for remote files
  onChange: (file: File | null) => void;
  disabled?: boolean;
  accept?: string;
  className?: string;
  required?: boolean; // Whether the field is required
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  id,
  label,
  value,
  src,
  onChange,
  disabled = false,
  accept = "image/*",
  className = "",
  required = false,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDocument, setIsDocument] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads/";
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isDocumentFile = (file: File | string) => {
    if (file instanceof File) {
      return (
        file.type.includes("pdf") ||
        file.type.includes("msword") ||
        file.type.includes("wordprocessingml")
      );
    }
    const fileName = file.toLowerCase();
    return (
      fileName.endsWith(".pdf") || fileName.endsWith(".doc") || fileName.endsWith(".docx")
    );
  };

  // Create preview URL when value changes

  useEffect(() => {
    if (value) {
      if (value instanceof File) {
        const isDoc = isDocumentFile(value);
        setIsDocument(isDoc);
        if (!isDoc) {
          const previewUrl = URL.createObjectURL(value);
          setPreview(previewUrl);
          return () => {
            URL.revokeObjectURL(previewUrl);
          };
        }
      } else if (typeof value === "string") {
        const isDoc = isDocumentFile(value);
        setIsDocument(isDoc);
        if (!isDoc) {
          setPreview(baseUrl + value);
        }
      }
    } else if (src) {
      const isDoc = isDocumentFile(src);
      setIsDocument(isDoc);
      if (!isDoc) {
        setPreview(baseUrl + src);
      }
    } else {
      setPreview(null);
      setIsDocument(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, src]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
    // Reset the input value so the same file can be selected again if needed
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click
    onChange(null);
    if (src) {
      setPreview(null);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Determine if the field is required based on the required prop and src presence
  const isRequired = required && !src;

  return (
    <div className={`flex relative flex-col gap-3 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center relative cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={disabled ? undefined : handleUploadClick}
      >
        {(preview || isDocument) && (
          <button
            type="button"
            onClick={handleRemove}
            className="bg-red-500 absolute top-2 right-2 hover:bg-red-600 text-white rounded-full  p-1 flex items-center gap-1"
            disabled={disabled}
            title="Remove"
          >
            <X size={16} />
          </button>
        )}
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          required={isRequired}
        />

        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt={label}
              className="max-h-48 mx-auto rounded-md"
              width={100}
              height={100}
            />
          </div>
        ) : isDocument ? (
          <div className="flex flex-col items-center justify-center">
            <FileText className="mb-2 text-gray-500" size={120} />
            <p className="text-muted-foreground">
              {label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="mb-2 text-gray-500" size={24} />
            <p className="text-muted-foreground">
              {label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePicker;
