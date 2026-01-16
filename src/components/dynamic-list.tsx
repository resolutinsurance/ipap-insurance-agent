"use client";

import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Pagination } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import {
  ExportColumn,
  generateFilename,
  getDefaultExportColumnsFromData,
} from "@/lib/utils/export";
import { DownloadIcon, X } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExportConfig, ExportModal } from "./modals/export-modal";
import TablePagination from "./table-pagination";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SearchBox from "./ui/search-box";

function useDebounce<T>(callback: (value: T) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [callback, delay]
  );
}

interface DynamicListProps<T> {
  data: T[];
  isLoading?: boolean;
  hideTitle?: boolean;
  renderItem: (item: T) => React.ReactNode;
  pagination?: Pagination;
  onPaginate?: (page: number) => void;
  className?: string;
  onItemClick?: (item: T) => void;
  showSearchField?: boolean;
  onSearch?: (value: string) => void;
  searchPlaceHolder?: string;
  onResetSearch?: () => void;
  title: string;
  showDateFilter?: boolean;
  dateColName?: string;
  clickableFilterItems?: {
    label: string;
    key: string;
  }[];
  onFilterChange?: (filter: string) => void;
  /** Show export action button (defaults to true) */
  showExportAction?: boolean;
  /** Export configuration - uses default config derived from data if not provided */
  exportConfig?: {
    /** Column definitions for export (which fields to include, headers) */
    columns?: ExportColumn[];
    /** File name prefix for exported file */
    filename?: string;
    /** Function to fetch data with date range (optional - for when APIs support it) */
    fetchForExport?: (startDate: Date, endDate: Date) => Promise<T[]>;
  };
}

export function DynamicList<T>({
  data,
  isLoading,
  renderItem,
  pagination,
  onPaginate,
  className,
  hideTitle,
  onItemClick,
  showSearchField,
  onSearch,
  searchPlaceHolder = "Search...",
  onResetSearch,
  title,
  showDateFilter,
  dateColName,
  clickableFilterItems,
  onFilterChange,
  showExportAction: showExportActionProp,
  exportConfig,
}: DynamicListProps<T>) {
  // Default showExportAction to true
  const showExportAction = showExportActionProp ?? true;

  const [selectedClickableFilter, setSelectedClickableFilter] = React.useState<
    string | null
  >(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Build export config for the modal with defaults
  const defaultExportColumns = useMemo(
    () => getDefaultExportColumnsFromData(data),
    [data]
  );
  const defaultFilename = useMemo(() => generateFilename(title), [title]);

  const exportModalConfig: ExportConfig<T> = {
    data: data,
    columns: exportConfig?.columns || defaultExportColumns,
    filename: exportConfig?.filename || defaultFilename,
    fetchForExport: exportConfig?.fetchForExport,
  };

  const handleSearch = useCallback(
    (searchValue: string) => {
      if (onSearch) {
        onSearch(searchValue);
      }
    },
    [onSearch]
  );

  const debouncedSearch = useDebounce(handleSearch, 300);

  const handleFilterChange = (filter: string) => {
    setSelectedClickableFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col md:flex-row items-start md:items-center lg:justify-between justify-start gap-4">
        <div className="flex flex-col md:flex-row gap-y-3">
          {!hideTitle && <h1 className="text-lg font-semibold">{title}</h1>}
          {clickableFilterItems && clickableFilterItems.length > 0 && (
            <ul className="flex flex-col md:flex-row items-start md:items-center gap-5">
              {clickableFilterItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => handleFilterChange(item.key)}
                  className={`cursor-pointer ${
                    selectedClickableFilter === item.key && "text-[#22BBEC] font-semibold"
                  }`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-max items-start md:items-center gap-5">
          {showExportAction && (
            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              className="gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              Export
            </Button>
          )}
          {showDateFilter && dateColName && (
            <div className="flex gap-5 items-center">
              <Input className="w-max" type="date" id="date_filter" />
              <Button
                className="scale-[0.7] -ml-4"
                variant="outline"
                size="icon"
                onClick={() => {
                  // Reset date filter
                }}
              >
                <X />
              </Button>
            </div>
          )}
          {showSearchField && (
            <div className="flex items-center gap-2">
              <SearchBox
                className="bg-[#F9FBFF]"
                onChange={(evt) => {
                  debouncedSearch(evt.target.value);
                }}
                placeholder={searchPlaceHolder}
              />
              {onResetSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onResetSearch}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading...</span>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No results found.</div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              onClick={() => onItemClick && onItemClick(item)}
              className={cn(
                "transition-colors",
                onItemClick && "cursor-pointer hover:bg-slate-50"
              )}
            >
              {renderItem(item)}
            </div>
          ))
        )}
      </div>

      {pagination && onPaginate && (
        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize || DEFAULT_PAGE_SIZE}
          onPageChange={onPaginate}
        />
      )}

      {/* Export Modal */}
      {showExportAction && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          config={exportModalConfig}
        />
      )}
    </div>
  );
}
