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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DateRangePreset,
  ExportColumn,
  ExportFormat,
  exportData,
  formatDateForDisplay,
  getDateRangeFromPreset,
} from "@/lib/utils/export";
import { CalendarIcon, FileSpreadsheetIcon, FileTextIcon, Loader2 } from "lucide-react";
import * as React from "react";

export interface ExportConfig<T> {
  /** Current data to export (default when no range selected) */
  data: T[];
  /** Function to fetch data with date range (optional - for when APIs support it) */
  fetchForExport?: (startDate: Date, endDate: Date) => Promise<T[]>;
  /** Column definitions for export (which fields to include, headers) */
  columns: ExportColumn[];
  /** File name prefix for exported file */
  filename: string;
}

interface ExportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  config: ExportConfig<T>;
}

const DATE_RANGE_PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: "allTime", label: "All Time (Current Data)" },
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "thisQuarter", label: "This Quarter" },
  { value: "thisYear", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

const FORMAT_OPTIONS: {
  value: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "csv",
    label: "CSV",
    description: "Comma-separated values, works with any spreadsheet app",
    icon: <FileTextIcon className="h-5 w-5" />,
  },
  {
    value: "xlsx",
    label: "Excel (XLSX)",
    description: "Microsoft Excel format with formatted columns",
    icon: <FileSpreadsheetIcon className="h-5 w-5" />,
  },
];

export function ExportModal<T>({ isOpen, onClose, config }: ExportModalProps<T>) {
  const [format, setFormat] = React.useState<ExportFormat>("csv");
  const [dateRangePreset, setDateRangePreset] =
    React.useState<DateRangePreset>("allTime");
  const [customStartDate, setCustomStartDate] = React.useState<string>("");
  const [customEndDate, setCustomEndDate] = React.useState<string>("");
  const [isExporting, setIsExporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const hasDateRangeFetch = Boolean(config.fetchForExport);

  // Get the computed date range based on preset or custom selection
  const getComputedDateRange = (): { startDate: Date; endDate: Date } | null => {
    if (dateRangePreset === "allTime") {
      return null; // Use current data
    }

    if (dateRangePreset === "custom") {
      if (!customStartDate || !customEndDate) {
        return null;
      }
      const startDate = new Date(customStartDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999);
      return { startDate, endDate };
    }

    return getDateRangeFromPreset(dateRangePreset);
  };

  // Get display text for the selected date range
  const getDateRangeDisplay = (): string => {
    if (dateRangePreset === "allTime") {
      return "Using currently loaded data";
    }

    const range = getComputedDateRange();
    if (!range) {
      return "Select dates";
    }

    return `${formatDateForDisplay(range.startDate)} - ${formatDateForDisplay(
      range.endDate
    )}`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      let dataToExport: T[] = config.data;

      // If a date range is selected and fetchForExport is available, fetch new data
      const dateRange = getComputedDateRange();
      if (dateRange && config.fetchForExport) {
        try {
          dataToExport = await config.fetchForExport(
            dateRange.startDate,
            dateRange.endDate
          );
        } catch (fetchError) {
          console.error("Failed to fetch data for export:", fetchError);
          setError(
            "Failed to fetch data for the selected date range. Using currently loaded data instead."
          );
          dataToExport = config.data;
        }
      } else if (dateRange && !config.fetchForExport) {
        // Date range selected but no fetch function available
        // This is expected - APIs don't support date filtering yet
        // Just use current data
      }

      if (dataToExport.length === 0) {
        setError("No data available to export.");
        setIsExporting(false);
        return;
      }

      await exportData({
        data: dataToExport as Record<string, unknown>[],
        columns: config.columns,
        filename: config.filename,
        format,
      });

      onClose();
    } catch (err) {
      console.error("Export failed:", err);
      setError("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      setError(null);
      setFormat("csv");
      setDateRangePreset("allTime");
      setCustomStartDate("");
      setCustomEndDate("");
      onClose();
    }
  };

  const isCustomRangeValid =
    dateRangePreset !== "custom" || (customStartDate && customEndDate);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose your export format and date range.
            {config.data.length > 0 && (
              <span className="block mt-1 text-xs">
                {config.data.length} records currently loaded
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as ExportFormat)}
              className="grid gap-3"
            >
              {FORMAT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    format === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value={option.value} />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-muted-foreground">{option.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Date Range</Label>
              {!hasDateRangeFetch && (
                <span className="text-xs text-muted-foreground ml-auto">
                  (API filter coming soon)
                </span>
              )}
            </div>

            <Select
              value={dateRangePreset}
              onValueChange={(value) => setDateRangePreset(value as DateRangePreset)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Custom Date Range Inputs */}
            {dateRangePreset === "custom" && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={customEndDate || undefined}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    min={customStartDate || undefined}
                  />
                </div>
              </div>
            )}

            {/* Date Range Display */}
            {dateRangePreset !== "allTime" && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                {getDateRangeDisplay()}
                {!hasDateRangeFetch && (
                  <span className="block mt-1 text-amber-600">
                    Note: Date filtering will use current data (API support pending)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || !isCustomRangeValid}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              `Export as ${format.toUpperCase()}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
