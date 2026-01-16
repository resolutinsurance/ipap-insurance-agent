import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UPLOADS_BASE_URL } from "@/lib/constants";
import { getValueType, renderComplexValue } from "@/lib/data-renderer";
import { cn, unmaskLabel } from "@/lib/utils";
import { ExternalLink, FileText } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value?: ReactNode | string | number | boolean | object | null | unknown;
  valueClassName?: string;
  htmlFor?: string;
}

const InfoRow = ({ label, value, valueClassName, htmlFor }: InfoRowProps) => {
  const displayLabel = unmaskLabel(label);

  // If value is already a ReactNode, use it directly
  if (value && typeof value === "object" && "$$typeof" in value) {
    return (
      <div className="border border-gray-200 p-2 rounded-md">
        <div className="flex justify-between items-center gap-4">
          <Label htmlFor={htmlFor || label} className="font-semibold shrink-0">
            {displayLabel}
          </Label>
          <div className={cn("font-medium", valueClassName)}>
            {value as unknown as ReactNode}
          </div>
        </div>
      </div>
    );
  }

  // Handle null/undefined/empty
  if (value === null || value === undefined || value === "") {
    return (
      <div className="border border-gray-200 p-2 rounded-md">
        <div className="flex justify-between items-center gap-4">
          <Label htmlFor={htmlFor || label} className="font-semibold shrink-0">
            {displayLabel}
          </Label>
          <p className={cn("text-sm", valueClassName)}>N/A</p>
        </div>
      </div>
    );
  }

  // File, Email, and Link detection and rendering
  if (typeof value === "string") {
    const lowerValue = value.toLowerCase();

    // Check for email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (isEmail) {
      return (
        <div className="border border-gray-200 p-2 rounded-md">
          <div className="flex justify-between items-center gap-4">
            <Label htmlFor={htmlFor || label} className="font-semibold shrink-0">
              {displayLabel}
            </Label>
            <a
              href={`mailto:${value}`}
              className={cn("text-sm text-blue-500 hover:underline", valueClassName)}
            >
              {value}
            </a>
          </div>
        </div>
      );
    }

    // Check for URL
    const isUrl = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(value);
    if (isUrl) {
      const href = value.startsWith("www.") ? `https://${value}` : value;
      return (
        <div className="border border-gray-200 p-2 rounded-md">
          <div className="flex justify-between items-center gap-4">
            <Label htmlFor={htmlFor || label} className="font-semibold shrink-0">
              {displayLabel}
            </Label>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-sm text-blue-500 hover:underline flex items-center gap-1",
                valueClassName
              )}
            >
              {value.slice(0, 50)}...
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      );
    }

    const isImage = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"].some((ext) =>
      lowerValue.endsWith(ext)
    );
    const isPdf = lowerValue.endsWith(".pdf");

    if (isImage || isPdf) {
      const fileUrl = value.startsWith("http") ? value : `${UPLOADS_BASE_URL}${value}`;

      return (
        <div className="border border-gray-200 p-2 rounded-md">
          <div className="flex justify-between items-center gap-4">
            <Label htmlFor={htmlFor || label} className="font-semibold shrink-0">
              {displayLabel}
            </Label>
            <div className={cn("flex items-center gap-3", valueClassName)}>
              {isImage ? (
                <div className="relative w-10 h-10 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                  <Image
                    src={fileUrl}
                    alt={displayLabel}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded border bg-red-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
              )}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 text-sm font-medium"
              >
                {isImage ? "View Image" : "View PDF"}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // Determine value type and render accordingly
  const valueType = getValueType(value);
  let renderedValue: ReactNode;

  if (valueType === "boolean") {
    renderedValue = (
      <div className="flex items-center space-x-2">
        <Switch checked={Boolean(value)} disabled />
        <span className="text-sm text-gray-600">{value ? "Yes" : "No"}</span>
      </div>
    );
  } else if (valueType === "array") {
    renderedValue = (
      <div className="flex flex-col items-end space-y-1">
        {Array.isArray(value) &&
          value.map((item, index) => (
            <p key={index} className="text-sm">
              • {renderComplexValue(item)}
            </p>
          ))}
      </div>
    );
  } else {
    renderedValue = renderComplexValue(value);
  }

  return (
    <div className="border border-gray-200 p-2 rounded-md">
      <div className="flex justify-between items-center gap-4">
        <Label htmlFor={htmlFor || label} className="font-semibold shrink-0">
          {displayLabel}
        </Label>
        {typeof renderedValue === "string" || typeof renderedValue === "number" ? (
          <p className={cn("text-sm text-right", valueClassName)}>{renderedValue}</p>
        ) : (
          <div className={cn("text-sm", valueClassName)}>{renderedValue}</div>
        )}
      </div>
    </div>
  );
};

export default InfoRow;
