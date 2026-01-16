import { ColumnDef } from "@tanstack/react-table";
import * as XLSX from "xlsx";

export type ExportFormat = "csv" | "xlsx" | "pdf";

export interface ExportColumn {
  key: string;
  header: string;
}

export interface ExportOptions {
  data: Record<string, unknown>[];
  columns: ExportColumn[];
  filename: string;
  format: ExportFormat;
}

/**
 * Get value from nested object path (e.g., "user.name" from { user: { name: "John" } })
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/**
 * Check if a string is an ISO date string
 */
function isISODateString(value: string): boolean {
  // Match ISO 8601 date formats: 2024-01-15, 2024-01-15T10:30:00, 2024-01-15T10:30:00.000Z
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  if (!isoDateRegex.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Format a date to a readable string
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a value for export (handles dates, arrays, objects, etc.)
 * - Empty/null/undefined values return "N/A"
 * - Dates are formatted as readable strings (e.g., "Jan 15, 2024")
 * - Arrays are joined with commas
 * - Objects are stringified with key extraction for common patterns
 */
function formatValue(value: unknown): string {
  // Handle null, undefined, empty strings
  if (value === null || value === undefined) {
    return "N/A";
  }

  // Handle empty strings
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return "N/A";
    }
    // Check if it's an ISO date string and format it
    if (isISODateString(trimmed)) {
      return formatDate(new Date(trimmed));
    }
    return trimmed;
  }

  // Handle Date objects
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      return "N/A";
    }
    return formatDate(value);
  }

  // Handle numbers (including 0)
  if (typeof value === "number") {
    if (isNaN(value)) {
      return "N/A";
    }
    // Format numbers with proper separators for large values
    return value.toLocaleString("en-US");
  }

  // Handle booleans
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "N/A";
    }
    return value.map((v) => formatValue(v)).join(", ");
  }

  // Handle objects
  if (typeof value === "object") {
    // Try to extract meaningful string from common object patterns
    const obj = value as Record<string, unknown>;

    // Common patterns: { name: "..." }, { fullname: "..." }, { title: "..." }
    if (obj.name && typeof obj.name === "string") return obj.name;
    if (obj.fullname && typeof obj.fullname === "string") return obj.fullname;
    if (obj.title && typeof obj.title === "string") return obj.title;
    if (obj.label && typeof obj.label === "string") return obj.label;
    if (obj.value && typeof obj.value === "string") return obj.value;

    // For user objects with nested user
    if (obj.user && typeof obj.user === "object") {
      const user = obj.user as Record<string, unknown>;
      if (user.fullname && typeof user.fullname === "string") return user.fullname;
      if (user.name && typeof user.name === "string") return user.name;
    }

    // Check if object is empty
    if (Object.keys(obj).length === 0) {
      return "N/A";
    }

    // Fallback to JSON for complex objects, but make it readable
    try {
      const jsonStr = JSON.stringify(obj);
      // If it's a simple object, return cleaned JSON
      if (jsonStr.length < 100) {
        return jsonStr.replace(/[{}"]/g, "").replace(/,/g, ", ").replace(/:/g, ": ");
      }
      return "[Complex Data]";
    } catch {
      return "N/A";
    }
  }

  return String(value);
}

/**
 * Convert data to a 2D array with headers for export
 */
function prepareDataForExport(
  data: Record<string, unknown>[],
  columns: ExportColumn[]
): string[][] {
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => formatValue(getNestedValue(row, col.key)))
  );
  return [headers, ...rows];
}

/**
 * Export data to CSV format and trigger download
 */
export function exportToCSV(options: Omit<ExportOptions, "format">): void {
  const { data, columns, filename } = options;
  const exportData = prepareDataForExport(data, columns);

  // Convert to CSV string
  const csvContent = exportData
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma, newline, or quote
          if (cell.includes(",") || cell.includes("\n") || cell.includes('"')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(",")
    )
    .join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export data to XLSX format and trigger download
 */
export function exportToXLSX(options: Omit<ExportOptions, "format">): void {
  const { data, columns, filename } = options;
  const exportData = prepareDataForExport(data, columns);

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(exportData);

  // Auto-size columns based on content
  const colWidths = columns.map((col, index) => {
    const maxLength = Math.max(
      col.header.length,
      ...exportData.slice(1).map((row) => (row[index] || "").length)
    );
    return { wch: Math.min(maxLength + 2, 50) };
  });
  worksheet["!cols"] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate and download file
  const xlsxBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([xlsxBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, `${filename}.xlsx`);
}

/**
 * Helper function to trigger file download
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Main export function that routes to the appropriate format handler
 */
export async function exportData(options: ExportOptions): Promise<void> {
  const { format, ...rest } = options;

  switch (format) {
    case "csv":
      exportToCSV(rest);
      break;
    case "xlsx":
      exportToXLSX(rest);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Date range preset types
 */
export type DateRangePreset =
  | "today"
  | "last7days"
  | "thisMonth"
  | "last30days"
  | "thisQuarter"
  | "thisYear"
  | "allTime"
  | "custom";

/**
 * Get date range from preset
 */
export function getDateRangeFromPreset(
  preset: DateRangePreset
): { startDate: Date; endDate: Date } | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(today);
  endDate.setHours(23, 59, 59, 999);

  switch (preset) {
    case "today":
      return { startDate: today, endDate };

    case "last7days": {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 6);
      return { startDate, endDate };
    }

    case "thisMonth": {
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate, endDate };
    }

    case "last30days": {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 29);
      return { startDate, endDate };
    }

    case "thisQuarter": {
      const quarter = Math.floor(today.getMonth() / 3);
      const startDate = new Date(today.getFullYear(), quarter * 3, 1);
      return { startDate, endDate };
    }

    case "thisYear": {
      const startDate = new Date(today.getFullYear(), 0, 1);
      return { startDate, endDate };
    }

    case "allTime":
    case "custom":
      return null;

    default:
      return null;
  }
}

/**
 * Format date for display
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Generate default export columns from table ColumnDef
 */
export function getDefaultExportColumns<T>(columns: ColumnDef<T>[]): ExportColumn[] {
  return columns
    .filter((col) => {
      // Only include columns with accessorKey (not action columns, etc.)
      const colDef = col as { accessorKey?: string };
      return colDef.accessorKey && colDef.accessorKey !== "actions";
    })
    .map((col) => {
      const colDef = col as { accessorKey?: string; header?: string };
      const key = colDef.accessorKey || "";
      // Try to get header as string, or use key as fallback
      let header = key;
      if (typeof colDef.header === "string") {
        header = colDef.header;
      } else if (key) {
        // Convert camelCase/snake_case to Title Case
        header = key
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase())
          .trim();
      }
      return { key, header };
    });
}

/**
 * Generate default export columns from the first data item's keys
 */
export function getDefaultExportColumnsFromData<T>(data: T[]): ExportColumn[] {
  if (data.length === 0) return [];

  const firstItem = data[0];
  if (typeof firstItem !== "object" || firstItem === null) return [];

  return Object.keys(firstItem)
    .filter((key) => {
      // Exclude common non-exportable fields
      const excludedKeys = ["id", "__typename", "actions"];
      return !excludedKeys.includes(key.toLowerCase());
    })
    .map((key) => ({
      key,
      // Convert camelCase/snake_case to Title Case
      header: key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase())
        .trim(),
    }));
}

/**
 * Generate a slug-friendly filename from a title
 */
export function generateFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
