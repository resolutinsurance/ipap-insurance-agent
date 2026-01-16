"use client";

import { convertBase64ToFile } from "@/lib/utils/file-utils";
import Signature, { SignatureRef } from "@uiw/react-signature";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import ImagePicker from "./image-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

interface SignaturePadProps {
  width?: number | string;
  height?: number;
  previewSrc?: string | File | null; // Initial signature to show as preview
  onSignatureChange?: (signature: File | string | null) => void; // Callback when signature changes
}

const SignaturePad = ({
  width = "100%",
  height = 200,
  previewSrc,
  onSignatureChange,
}: SignaturePadProps) => {
  const signaturePadRef = useRef<SignatureRef>(null);
  const [signatureMethod, setSignatureMethod] = useState<"pad" | "upload">("pad");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [showPadPreview, setShowPadPreview] = useState(false);

  // Load initial signature if provided
  useEffect(() => {
    if (previewSrc) {
      if (previewSrc instanceof File) {
        // If it's a File, set it directly
        setSignatureFile(previewSrc);
        setSignatureMethod("upload");
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setSignaturePreview(reader.result as string);
        };
        reader.readAsDataURL(previewSrc);
      } else if (typeof previewSrc === "string") {
        // Check if it's a URL (starts with http:// or https://) or uploads base URL
        const isUrl =
          previewSrc.startsWith("http://") || previewSrc.startsWith("https://");

        if (isUrl) {
          // It's a URL - use it directly for preview
          setSignaturePreview(previewSrc);
          setSignatureMethod("upload"); // Treat as uploaded file
          // Don't try to convert URL to File - just show the preview
        } else if (previewSrc.includes("image/svg+xml")) {
          // Base64 SVG from signature pad
          setSignatureMethod("pad");
          setSignaturePreview(previewSrc);
          setShowPadPreview(true); // Show preview initially
        } else {
          // Base64 image string - try to convert back to File for editing
          try {
            const file = convertBase64ToFile(previewSrc, "signature");
            setSignatureFile(file);
            setSignatureMethod("upload");
            setSignaturePreview(previewSrc);
          } catch (error) {
            console.error("Failed to convert base64 to file:", error);
            // Still show preview even if conversion fails
            setSignaturePreview(previewSrc);
          }
        }
      }
    }
  }, [previewSrc]);

  // Get signature data as base64 string or File
  const getSignatureData = (): File | string | null => {
    if (signatureMethod === "upload") {
      return signatureFile;
    } else {
      // Get signature from pad as base64
      const svgElement = signaturePadRef.current?.svg;
      if (!svgElement) {
        return null;
      }
      const svgString = new XMLSerializer().serializeToString(svgElement);
      // Convert SVG to base64 data URL
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
    }
  };

  // Notify parent when signature changes (for uploads and method changes)
  useEffect(() => {
    if (onSignatureChange) {
      const signature = getSignatureData();
      onSignatureChange(signature);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureFile, signatureMethod, showPadPreview]);

  // Periodically check pad for changes (when pad is active and not showing preview)
  useEffect(() => {
    if (signatureMethod === "pad" && !showPadPreview) {
      const interval = setInterval(() => {
        if (onSignatureChange) {
          const signature = getSignatureData();
          onSignatureChange(signature);
        }
      }, 500); // Check every 500ms

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureMethod, showPadPreview]);

  const handleClear = () => {
    if (signatureMethod === "pad") {
      signaturePadRef.current?.clear();
      setSignaturePreview(null);
      setShowPadPreview(false);
    } else {
      setSignatureFile(null);
      setSignaturePreview(null);
    }
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  };

  // Handle when user starts drawing on the pad - switch from preview to pad
  const handlePadStart = () => {
    if (showPadPreview) {
      setShowPadPreview(false); // Switch to pad when user starts drawing
    }
  };

  // Handle file upload change
  const handleFileChange = (file: File | null) => {
    setSignatureFile(file);
    if (file) {
      // Create preview for display
      const reader = new FileReader();
      reader.onload = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSignaturePreview(null);
    }
  };

  return (
    <div className="space-y-2">
      <Tabs
        value={signatureMethod}
        onValueChange={(v) => setSignatureMethod(v as "pad" | "upload")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pad">Draw Signature</TabsTrigger>
          <TabsTrigger value="upload">Upload Signature</TabsTrigger>
        </TabsList>
        <TabsContent value="pad" className="space-y-2">
          <div className="w-full border border-gray-200 rounded-md overflow-hidden relative">
            {signaturePreview && signatureMethod === "pad" && showPadPreview ? (
              <div
                className="relative w-full bg-white cursor-pointer"
                style={{ height }}
                onClick={handlePadStart}
                onTouchStart={handlePadStart}
              >
                <Image
                  width={200}
                  height={200}
                  src={signaturePreview}
                  alt="Signature preview - click to edit"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="bg-white"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div onMouseDown={handlePadStart} onTouchStart={handlePadStart}>
                  <Signature ref={signaturePadRef} width={width} height={height} />
                </div>
                <div className="absolute bottom-2 right-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="bg-white"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="upload" className="space-y-2">
          <ImagePicker
            id="signature-upload"
            label="Upload Signature Image"
            value={signatureFile}
            onChange={handleFileChange}
            accept="image/*"
            required={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignaturePad;
