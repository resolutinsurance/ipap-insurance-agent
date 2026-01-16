import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function renderObjectFields<T extends Record<string, unknown>>(
  obj: T,
  excludeKeys: (keyof T)[] = []
) {
  return Object.entries(obj)
    .filter(
      ([key, value]) =>
        !excludeKeys.includes(key as keyof T) &&
        value !== null &&
        value !== undefined &&
        value !== ""
    )
    .map(([key, value]) => {
      // Format key to user-friendly label
      const label = key
        .replace(/([A-Z])/g, " $1") // camelCase to space
        .replace(/_/g, " ") // snake_case to space
        .replace(/\b\w/g, (l) => l.toUpperCase()) // capitalize words
        .replace(/\s+/g, " ") // remove double spaces
        .trim();
      // Format value if it's a date string
      let displayValue = value;
      if (
        typeof value === "string" &&
        (key.toLowerCase().includes("date") || /^\d{4}-\d{2}-\d{2}/.test(value))
      ) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          displayValue = date.toLocaleDateString();
        }
      }
      return (
        <div className="space-y-2" key={key}>
          <Label>{label}</Label>
          <Input readOnly value={displayValue as string} />
        </div>
      );
    });
}
