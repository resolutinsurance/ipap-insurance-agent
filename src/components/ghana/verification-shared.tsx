"use client";

import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import React from "react";

export const StartVerification: React.FC<{
  handleStartVerification: () => void;
}> = ({ handleStartVerification }) => (
  <div className="flex flex-col items-center space-y-6">
    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
      <Camera className="w-10 h-10 text-primary" />
    </div>
    <div className="text-center space-y-4">
      <h2 className="text-lg font-semibold">Start Selfie Verification</h2>
      <p className="text-gray-600 text-sm">
        Click the button below to begin the selfie verification process. You&apos;ll need
        to allow camera access to proceed.
      </p>
    </div>
    <Button onClick={handleStartVerification} size="lg" className="w-full">
      Start Selfie Verification
    </Button>
  </div>
);

export const CameraInput: React.FC<{
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  captureSelfie: () => void;
  handlePrevious: () => void;
}> = ({ videoRef, canvasRef, captureSelfie, handlePrevious }) => (
  <div className="flex flex-col h-full items-center space-y-6">
    <div className="text-center space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-primary">📸 Photo Requirements:</p>
        <ul className="text-xs text-primary space-y-1">
          <li>• Position your face in the center of the frame</li>
          <li>• Ensure your entire head, face, eyes, ears, and neck are visible</li>
          <li>• Look directly at the camera with a neutral expression</li>
          <li>• Make sure you&apos;re in a well-lit area</li>
          <li>• Remove glasses, hats, or any face coverings</li>
        </ul>
      </div>
    </div>

    <div className="w-full relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full aspect-auto h-full border rounded-lg"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>

    <div className="flex w-full gap-3">
      <Button variant="outline" onClick={handlePrevious} className="flex-1">
        Previous
      </Button>
      <Button onClick={captureSelfie} className="flex-1">
        Capture Selfie
      </Button>
    </div>
  </div>
);

export const VerificationResult: React.FC<{
  isVerificationSuccessful: boolean;
  handleRetry: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
}> = ({ isVerificationSuccessful, handleRetry, handleNext, handlePrevious }) => (
  <div className="flex flex-col items-center space-y-6">
    <div className="text-center flex flex-col items-center gap-4">
      {isVerificationSuccessful ? (
        <>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-green-600">
            Verification Successful!
          </h2>
          <p className="text-gray-600 text-sm">
            Your identity has been successfully verified. You can now proceed with your
            account.
          </p>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-red-600">Verification Failed</h2>
          <p className="text-gray-600 text-sm">
            We couldn&apos;t verify your identity. Please try again with better lighting
            and a clear view of your face.
          </p>
        </>
      )}
    </div>

    <div className="flex w-full gap-3">
      <Button variant="outline" onClick={handlePrevious} className="flex-1">
        Previous
      </Button>
      {!isVerificationSuccessful && (
        <Button onClick={handleRetry} className="flex-1">
          Try Again
        </Button>
      )}
      {isVerificationSuccessful && (
        <Button onClick={handleNext} className="flex-1">
          Continue
        </Button>
      )}
    </div>
  </div>
);
