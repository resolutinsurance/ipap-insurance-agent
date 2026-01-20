import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_FREQUENCIES } from "@/lib/constants/bundle";
import { PaymentFrequency } from "@/lib/interfaces";

interface PaymentFrequencySelectorProps {
  value: PaymentFrequency;
  onChange: (value: PaymentFrequency) => void;
  id?: string;
  label?: string;
  options?: string[];
}

export const PaymentFrequencySelector = ({
  value,
  onChange,
  id = "paymentFrequency",
  label = "Payment Frequency",
}: PaymentFrequencySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select payment frequency" />
        </SelectTrigger>
        <SelectContent>
          {PAYMENT_FREQUENCIES.map((freq) => (
            <SelectItem key={freq} value={freq}>
              {freq.charAt(0).toUpperCase() + freq.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
