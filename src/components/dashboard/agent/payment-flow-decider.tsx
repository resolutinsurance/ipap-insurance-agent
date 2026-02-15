'use client'

import { cn } from '@/lib/utils'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@resolutinsurance/ipap-shared/components'

interface AgentPaymentFlowDeciderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectStandard: () => void
  onSelectRemote: () => void
  className?: string
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
      <DialogContent className={cn('max-w-xl', className)}>
        <DialogHeader>
          <DialogTitle>Select payment flow</DialogTitle>
          <DialogDescription>
            Choose how you want to process this customer&apos;s Pay Small Small
            (premium financing) payment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <button
            type="button"
            onClick={onSelectStandard}
            className="bg-muted/40 hover:border-primary hover:bg-primary/5 focus-visible:ring-primary flex flex-col items-start justify-between gap-2 rounded-lg border p-4 text-left transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold">Standard Agent Flow</p>
              <p className="text-muted-foreground text-xs">
                Continue with the normal in-branch flow. You guide the customer
                through all verification and payment steps.
              </p>
            </div>
            <span className="text-primary text-xs font-medium">
              Continue with standard flow
            </span>
          </button>

          <button
            type="button"
            onClick={onSelectRemote}
            className="bg-muted/40 hover:border-primary hover:bg-primary/5 focus-visible:ring-primary flex flex-col items-start justify-between gap-2 rounded-lg border p-4 text-left transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                Agent Flow with remote verification
              </p>
              <p className="text-muted-foreground text-xs">
                You complete loan calculation and initial checks, then send a
                secure link for the customer to finish verification and payment
                on their own device.
              </p>
            </div>
            <span className="text-primary text-xs font-medium">
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
  )
}

export default AgentPaymentFlowDecider
