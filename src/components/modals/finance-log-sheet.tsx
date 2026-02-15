import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@resolutinsurance/ipap-shared/components'
import InfoRow from '../dashboard/payment/details/info-row'

const FinanceLogSheet = ({
  isDetailsOpen,
  setIsDetailsOpen,
  selectedRow,
  setSelectedRow,
  type,
  selectedRowFields,
}: {
  isDetailsOpen: boolean
  setIsDetailsOpen: (open: boolean) => void
  selectedRow: Record<string, unknown> | null
  setSelectedRow: (row: Record<string, unknown> | null) => void
  type: 'FINANCIAL_ENTRIES' | 'TRANSACTION_JOURNALS'
  selectedRowFields: { key: string; label: string; value: unknown }[]
}) => {
  return (
    <Sheet
      open={isDetailsOpen}
      onOpenChange={(open) => {
        setIsDetailsOpen(open)
        if (!open) {
          setSelectedRow(null)
        }
      }}
    >
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {type === 'FINANCIAL_ENTRIES'
              ? 'Financial Entry Details'
              : 'Transaction Journal Details'}
          </SheetTitle>
          <SheetDescription>Click outside to close.</SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-4 pb-4">
          {selectedRow ? (
            <div className="space-y-2">
              {selectedRowFields.map((field) => (
                <InfoRow
                  key={field.key}
                  label={field.label}
                  value={field.value}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No row selected.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FinanceLogSheet
