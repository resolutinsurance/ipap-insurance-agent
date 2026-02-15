'use client'

import { Button } from '@resolutinsurance/ipap-shared/components'
import { Camera, CheckCircle, XCircle } from 'lucide-react'
import React from 'react'

export const StartVerification: React.FC<{
  handleStartVerification: () => void
}> = ({ handleStartVerification }) => (
  <div className="flex flex-col items-center space-y-6">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
      <Camera className="text-primary h-10 w-10" />
    </div>
    <div className="space-y-4 text-center">
      <h2 className="text-lg font-semibold">Start Selfie Verification</h2>
      <p className="text-sm text-gray-600">
        Click the button below to begin the selfie verification process.
        You&apos;ll need to allow camera access to proceed.
      </p>
    </div>
    <Button onClick={handleStartVerification} size="lg" className="w-full">
      Start Selfie Verification
    </Button>
  </div>
)

export const CameraInput: React.FC<{
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  captureSelfie: () => void
  handlePrevious: () => void
}> = ({ videoRef, canvasRef, captureSelfie, handlePrevious }) => (
  <div className="flex h-full flex-col items-center space-y-6">
    <div className="space-y-4 text-center">
      <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-primary text-sm font-medium">
          📸 Photo Requirements:
        </p>
        <ul className="text-primary space-y-1 text-xs">
          <li>• Position your face in the center of the frame</li>
          <li>
            • Ensure your entire head, face, eyes, ears, and neck are visible
          </li>
          <li>• Look directly at the camera with a neutral expression</li>
          <li>• Make sure you&apos;re in a well-lit area</li>
          <li>• Remove glasses, hats, or any face coverings</li>
        </ul>
      </div>
    </div>

    <div className="relative w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="aspect-auto h-full w-full rounded-lg border"
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
)

export const VerificationResult: React.FC<{
  isVerificationSuccessful: boolean
  handleRetry: () => void
  handleNext: () => void
  handlePrevious: () => void
}> = ({
  isVerificationSuccessful,
  handleRetry,
  handleNext,
  handlePrevious,
}) => (
  <div className="flex flex-col items-center space-y-6">
    <div className="flex flex-col items-center gap-4 text-center">
      {isVerificationSuccessful ? (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-green-600">
            Verification Successful!
          </h2>
          <p className="text-sm text-gray-600">
            Your identity has been successfully verified. You can now proceed
            with your account.
          </p>
        </>
      ) : (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-red-600">
            Verification Failed
          </h2>
          <p className="text-sm text-gray-600">
            We couldn&apos;t verify your identity. Please try again with better
            lighting and a clear view of your face.
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
)
