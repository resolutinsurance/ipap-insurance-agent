/* eslint-disable @typescript-eslint/no-explicit-any */
// Function to render complex data structures (nested objects and arrays)
export const renderComplexValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    // Sort array items for consistent ordering
    const sortedItems = [...value].sort((a, b) => {
      if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b);
      }
      if (typeof a === "number" && typeof b === "number") {
        return a - b;
      }
      return 0;
    });
    return sortedItems.map((item) => renderComplexValue(item)).join(", ");
  }

  if (typeof value === "object") {
    // Sort object entries by key for consistent ordering
    const sortedEntries = Object.entries(value)
      .filter(([, val]) => val !== null && val !== undefined && val !== "")
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    return sortedEntries
      .map(([key, val]) => `${key}: ${renderComplexValue(val)}`)
      .join("; ");
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
  }

  return String(value);
};

// Function to check if a value is boolean
export const isBooleanValue = (value: any): boolean => {
  return typeof value === "boolean";
};

// Function to get the data type for rendering
export const getValueType = (
  value: any
): "boolean" | "array" | "object" | "string" | "number" | "date" => {
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object" && value !== null) return "object";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return "date";
  if (typeof value === "number") return "number";
  return "string";
};

// Function to get the last part of a nested key (e.g., "Bundle Name.Id" -> "Id")
const getLastKeyPart = (key: string): string => {
  // Split by dot or bracket and get the last part
  const parts = key.split(/[.\[\]]/);
  return parts[parts.length - 1] || key;
};

// Function to format key names for display
export const formatKeyName = (key: string): string => {
  // Get only the last part of nested keys
  const lastKey = getLastKeyPart(key);

  return lastKey
    .replace(/([A-Z])/g, " $1") // camelCase to space
    .replace(/_/g, " ") // snake_case to space
    .replace(/\b\w/g, (l) => l.toUpperCase()) // capitalize words
    .replace(/\s+/g, " ") // remove double spaces
    .trim();
};

// Function to check if a key should be excluded (non-user-facing)
const shouldExcludeKey = (key: string): boolean => {
  const lowerKey = key.toLowerCase();
  const lastKey = getLastKeyPart(lowerKey);

  // Exclude common non-user-facing fields
  const excludePatterns = [
    "id",
    "uuid",
    "updatedat",
    "updated_at",
    "createdat", // Sometimes we want this, but if it's nested, exclude
    "created_at",
    "deletedat",
    "deleted_at",
    "password",
    "token",
    "secret",
    "api_key",
    "apikey",
    "internal",
    "system",
  ];

  // Check if the last part matches any exclude pattern
  return excludePatterns.some(
    (pattern) =>
      lastKey === pattern || lastKey.endsWith(`_${pattern}`) || lastKey.endsWith(pattern)
  );
};

// Function to flatten nested objects and arrays for display
export const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
  const flattened: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip bundleProducts field
    if (key === "bundleProducts" || key.toLowerCase().includes("bundleproducts")) {
      continue;
    }

    // Skip excluded keys at any level
    if (shouldExcludeKey(key)) {
      continue;
    }

    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      // Handle arrays by joining them or creating indexed entries
      if (value.length === 0) continue;

      if (typeof value[0] === "object" && value[0] !== null) {
        // Array of objects - create indexed entries
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            Object.assign(flattened, flattenObject(item, `${newKey}[${index}]`));
          } else {
            flattened[`${newKey}[${index}]`] = item;
          }
        });
      } else {
        // Simple array - join values
        flattened[newKey] = value.join(", ");
      }
    } else if (typeof value === "object" && value !== null) {
      // Nested object - recursively flatten
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      // Simple value
      flattened[newKey] = value;
    }
  }

  return flattened;
};

// Function to prepare object fields for rendering with InfoRow components
export const prepareObjectFields = <T extends Record<string, unknown>>(
  obj: T,
  excludeKeys: (keyof T)[] = []
): Array<{ key: string; label: string; value: unknown }> => {
  const entries = Object.entries(obj).filter(([key, value]) => {
    // Check manual exclusions
    if (excludeKeys.includes(key as keyof T)) {
      return false;
    }

    // Check automatic exclusions (id, uuid, updatedAt, etc.)
    if (shouldExcludeKey(key)) {
      return false;
    }

    // Filter out null/undefined/empty values
    if (value === null || value === undefined || value === "") {
      return false;
    }

    return true;
  });

  return entries.map(([key, value]) => {
    const label = formatKeyName(key);
    return {
      key,
      label,
      value,
    };
  });
};
