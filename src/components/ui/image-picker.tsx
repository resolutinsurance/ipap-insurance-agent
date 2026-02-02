import { isDocumentFile } from "@/lib/utils/file-utils";
import { FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef } from "react";

interface ImagePickerProps {
  id: string;
  label: string;
  value: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  accept?: string;
  className?: string;
  required?: boolean;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  accept = "image/*",
  className = "",
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { previewUrl, isDocument, objectUrlToRevoke } = useMemo(() => {
    if (!value) {
      return { previewUrl: null, isDocument: false, objectUrlToRevoke: null };
    }

    const isDoc = isDocumentFile(value);
    if (isDoc) {
      return { previewUrl: null, isDocument: true, objectUrlToRevoke: null };
    }

    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      return { previewUrl: url, isDocument: false, objectUrlToRevoke: url };
    }

    return { previewUrl: value, isDocument: false, objectUrlToRevoke: null };
  }, [value]);

  // Cleanup for object URLs created from File inputs.
  useEffect(() => {
    return () => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
    };
  }, [objectUrlToRevoke]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
    event.target.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const hasContent = previewUrl || isDocument;

  return (
    <div className={`flex relative flex-col gap-3 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center relative cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleClick}
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          required={required}
        />

        {hasContent && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
            disabled={disabled}
          >
            <X size={16} />
          </button>
        )}

        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={label}
            className="max-h-48 mx-auto rounded-md object-contain"
            width={1500}
            height={300}
          />
        ) : isDocument ? (
          <div className="flex flex-col items-center">
            <FileText className="text-gray-500" size={120} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="text-gray-400" size={32} />
            <p className="text-sm text-muted-foreground">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePicker;
