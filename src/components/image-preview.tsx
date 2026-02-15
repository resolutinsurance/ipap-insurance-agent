import { Dialog, DialogContent } from '@resolutinsurance/ipap-shared/components'
import Image from 'next/image'
import { useState } from 'react'

interface ImagePreviewProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function ImagePreview({
  src,
  alt,
  width = 100,
  height = 100,
  className,
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        className="cursor-pointer transition-opacity hover:opacity-80"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full p-0 sm:max-w-7xl">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
