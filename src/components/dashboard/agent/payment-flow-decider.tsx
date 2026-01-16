"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AgentPaymentFlowDeciderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectStandard: () => void;
  onSelectRemote: () => void;
  className?: string;
}

const AgentPaymentFlowDecider = ({
  open,
  onOpenChange,
  onSelectStandard,
  onSelectRemote,
  className,
}: AgentPaymentFlowDeciderProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-xl", className)}>
        <DialogHeader>
          <DialogTitle>Select payment flow</DialogTitle>
          <DialogDescription>
            Choose how you want to process this customer&apos;s Pay Small Small (premium
            financing) payment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={onSelectStandard}
            className="flex h-40 flex-col items-start justify-between rounded-lg border bg-muted/40 p-4 text-left transition hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div>
              <p className="text-sm font-semibold">Standard Agent Flow</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Continue with the normal in-branch flow. You guide the customer through
                all verification and payment steps.
              </p>
            </div>
            <span className="text-xs font-medium text-primary">
              Continue with standard flow
            </span>
          </button>

          <button
            type="button"
            onClick={onSelectRemote}
            className="flex h-40 flex-col items-start justify-between rounded-lg border bg-muted/40 p-4 text-left transition hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div>
              <p className="text-sm font-semibold">Agent Flow with remote verification</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You complete loan calculation and initial checks, then send a secure link
                for the customer to finish verification and payment on their own device.
              </p>
            </div>
            <span className="text-xs font-medium text-primary">
              Start remote verification flow
            </span>
          </button>
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentPaymentFlowDecider;
