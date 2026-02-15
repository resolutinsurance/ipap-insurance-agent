import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@resolutinsurance/ipap-shared/components'

interface DurationSelectorProps {
  value: number
  onChange: (value: number) => void
  id?: string
  label?: string
}

export const DurationSelector = ({
  value,
  onChange,
  id = 'duration',
  label = 'Duration (How long to finish payment?)',
}: DurationSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((month) => (
            <SelectItem key={month} value={month.toString()}>
              {month} {month === 1 ? 'month' : 'months'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
