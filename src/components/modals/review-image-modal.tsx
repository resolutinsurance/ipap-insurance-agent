import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ReviewImageModalProps {
  showImageModal: boolean;
  setShowImageModal: (show: boolean) => void;
  capturedImage: string | null;
  retakeImage: () => void;
  confirmImage: () => void;
  isVerifying: boolean;
  isPending: boolean;
}
const ReviewImageModal = (props: ReviewImageModalProps) => {
  return (
    <Dialog open={props.showImageModal} onOpenChange={props.setShowImageModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Your Photo</DialogTitle>
          <DialogDescription>
            Please review your captured image. If you&apos;re satisfied, click &quot;Use
            This Photo&quot; to proceed with verification.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          {props.capturedImage && (
            <Image
              src={props.capturedImage}
              alt="Captured selfie"
              className="w-full max-w-sm border rounded-lg"
              width={200}
              height={200}
            />
          )}
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={props.retakeImage}
            className="flex-1"
            disabled={props.isVerifying || props.isPending}
          >
            Retake Photo
          </Button>
          <Button
            onClick={props.confirmImage}
            className="flex-1"
            disabled={props.isVerifying || props.isPending}
          >
            {props.isVerifying || props.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Use This Photo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewImageModal;
