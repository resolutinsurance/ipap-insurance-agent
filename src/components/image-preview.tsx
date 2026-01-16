import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

interface ImagePreviewProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ImagePreview({
  src,
  alt,
  width = 100,
  height = 100,
  className,
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(true)}
      >
        <Image src={src} alt={alt} width={width} height={height} className={className} />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-7xl w-full p-0">
          <div className="relative w-full aspect-[4/3]">
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
  );
}
