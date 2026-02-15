'use client'

import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@resolutinsurance/ipap-shared/components'
import Signature, { SignatureRef } from '@uiw/react-signature'
import { TrashIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ImagePicker from './image-picker'

interface SignaturePadProps {
  width?: number | string
  height?: number
  previewSrc?: string | File | null // Initial signature to show as preview
  onSignatureChange?: (signature: File | string | null) => void // Callback when signature changes
}

const SignaturePad = ({
  width = '100%',
  height = 200,
  previewSrc,
  onSignatureChange,
}: SignaturePadProps) => {
  const signaturePadRef = useRef<SignatureRef>(null)
  const [signatureMethod, setSignatureMethod] = useState<'pad' | 'upload'>(
    previewSrc ? 'upload' : 'pad',
  )
  const [signatureFile, setSignatureFile] = useState<File | string | null>(
    previewSrc ?? null,
  )

  const getPadSignatureDataUrl = (): string | null => {
    const svgElement = signaturePadRef.current?.svg
    if (!svgElement) return null
    const svgString = new XMLSerializer().serializeToString(svgElement)
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`
  }

  const setSignature = (next: File | string | null) => {
    setSignatureFile(next)
    onSignatureChange?.(next)
  }

  const handleClear = () => {
    signaturePadRef.current?.clear()
    setSignature(null)
  }

  // Handle file upload change
  const handleFileChange = (file: File | null) => {
    setSignature(file)
  }

  const handlePadCommit = () => {
    const dataUrl = getPadSignatureDataUrl()
    if (dataUrl) setSignature(dataUrl)
  }

  useEffect(() => {
    if (previewSrc) {
      setSignatureMethod('upload')
      setSignature(previewSrc)
    }
  }, [previewSrc])

  return (
    <div className="space-y-2">
      <Tabs
        value={signatureMethod}
        onValueChange={(v) => setSignatureMethod(v as 'pad' | 'upload')}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pad">Draw Signature</TabsTrigger>
          <TabsTrigger value="upload">Upload Signature</TabsTrigger>
        </TabsList>
        <TabsContent value="pad" className="space-y-2">
          <div className="relative w-full overflow-hidden rounded-md border border-gray-200">
            <div onPointerUp={handlePadCommit} onPointerLeave={handlePadCommit}>
              <Signature ref={signaturePadRef} width={width} height={height} />
            </div>
            <div className="absolute right-2 bottom-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="bg-white"
              >
                <TrashIcon className="mr-1 h-4 w-4" />
                Clear
              </Button>
            </div>
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
  )
}

export default SignaturePad
