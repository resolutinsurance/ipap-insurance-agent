"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Pagination } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import {
  ExportColumn,
  generateFilename,
  getDefaultExportColumnsFromData,
} from "@/lib/utils/export";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, DownloadIcon, X } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExportConfig, ExportModal } from "./modals/export-modal";
import TablePagination from "./table-pagination";
import { Input } from "./ui/input";
import SearchBox from "./ui/search-box";

// Add simple debounce hook
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

export function RenderDataTable<T>(props: {
  data: T[];
  isLoading?: boolean;
  searchFn?: (value: string) => void;
  showPagination?: boolean;
  setPagination?: React.Dispatch<React.SetStateAction<Pagination>>;
  pagination?: Pagination;
  columns: ColumnDef<T>[];
  pageCount?: number;
  onPaginate?: (page: number) => void;
  hideTitle?: boolean;
  className?: string;
  onRowClicked?: (data: T) => void;
  dateColName?: string;
  searchColName?: string;
  searchPlaceHolder?: string;
  showSearchField?: boolean;
  onSearch?: (value: string) => void;
  title: string;
  showDateFilter?: boolean;
  /** Show export action button (defaults to true) */
  showExportAction?: boolean;
  /** Export configuration - uses default config derived from columns if not provided */
  exportConfig?: {
    /** Column definitions for export (which fields to include, headers) */
    columns?: ExportColumn[];
    /** File name prefix for exported file */
    filename?: string;
    /** Function to fetch data with date range (optional - for when APIs support it) */
    fetchForExport?: (startDate: Date, endDate: Date) => Promise<T[]>;
  };
  clickableFilterItems?: {
    label: string;
    key: string;
  }[];
  onResetSearch?: () => void;
  hasStatusColumn?: boolean;
}) {
  // Default showExportAction to true
  const showExportAction = props.showExportAction ?? true;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedClickableFilter, setSelectedClickableFilter] = React.useState<
    string | null
  >(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Enable manual pagination to use backend pagination
    manualPagination: true,
    pageCount: props.pageCount,
    // Set initial page size from props
    initialState: {
      pagination: {
        pageSize: props.pagination?.pageSize || DEFAULT_PAGE_SIZE,
      },
    },
  });

  // Build export config for the modal with defaults
  // Use data-based column extraction to get all fields, not just table display columns
  const defaultExportColumns = React.useMemo(
    () => getDefaultExportColumnsFromData(props.data),
    [props.data]
  );
  const defaultFilename = React.useMemo(
    () => generateFilename(props.title),
    [props.title]
  );

  const exportModalConfig: ExportConfig<T> = {
    data: props.data,
    columns: props.exportConfig?.columns || defaultExportColumns,
    filename: props.exportConfig?.filename || defaultFilename,
    fetchForExport: props.exportConfig?.fetchForExport,
  };

  useEffect(() => {
    // Only run status filter if table has status column
    if (props.hasStatusColumn) {
      table
        .getColumn("status")
        ?.setFilterValue(
          selectedClickableFilter !== "ALL" ? selectedClickableFilter : null
        );
    }
  }, [selectedClickableFilter, table, props.hasStatusColumn]);

  const handleSearch = useCallback(
    (searchValue: string) => {
      if (props.onSearch) {
        props.onSearch(searchValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onSearch]
  );

  const debouncedSearch = useDebounce(handleSearch, 300);

  return (
    <div className={cn("w-full", props.className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3 my-3 sm:my-5">
          {props.hideTitle !== true && (
            <h1 className="text-lg sm:text-[22px] font-semibold">{props.title}</h1>
          )}
          {props.clickableFilterItems && props.clickableFilterItems.length && (
            <ul className="flex flex-wrap items-center gap-3 sm:gap-5">
              {props.clickableFilterItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => setSelectedClickableFilter(item.key)}
                  className={`cursor-pointer text-sm sm:text-base ${
                    selectedClickableFilter === item.key && "text-[#22BBEC] font-semibold"
                  }`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 py-2 sm:py-4">
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
          {props.showDateFilter && (
            <div className="flex items-center gap-2">
              <Input
                className="w-full sm:w-[150px]"
                type="date"
                id="pf_date_table_filter"
                onChange={(event) => {
                  const isoDate = new Date(event.target.value).toISOString();
                  table.getColumn(String(props.dateColName))?.setFilterValue(isoDate);
                }}
              />
              <Button
                className="scale-[0.7] -ml-4"
                variant="outline"
                size="icon"
                onClick={() => {
                  table.getColumn(String(props.dateColName))?.setFilterValue("");
                }}
              >
                <X />
              </Button>
            </div>
          )}
          {props.showSearchField && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SearchBox
                className="bg-[#F9FBFF] flex-1 sm:flex-none"
                onChange={(evt) => {
                  debouncedSearch(evt.target.value);
                }}
                placeholder={props.searchPlaceHolder}
              />
              {props.onResetSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={props.onResetSearch}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="text-muted-foreground border">
              <Button variant="ghost" className="sm:w-auto sm:ml-auto">
                <span>Columns</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="whitespace-nowrap text-xs sm:text-sm"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {props.isLoading ? (
              <TableRow>
                <TableCell colSpan={props.columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm sm:text-base">Searching...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : Array.isArray(props.data) && props.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={props.columns.length} className="h-24 text-center">
                  <span className="text-sm sm:text-base">No results found.</span>
                </TableCell>
              </TableRow>
            ) : Array.isArray(props.data) ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="whitespace-nowrap"
                  style={{
                    cursor: props?.onRowClicked ? "pointer" : "default",
                  }}
                  onClick={() => props?.onRowClicked && props.onRowClicked(row.original)}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs sm:text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={props.columns.length} className="h-24 text-center">
                  <span className="text-sm sm:text-base">Error loading data.</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {props.pagination && props.showPagination && props.onPaginate && (
        <TablePagination
          page={props.pagination.page}
          totalPages={props.pagination.totalPages}
          totalItems={props.pagination.totalItems}
          pageSize={props.pagination.pageSize}
          onPageChange={props.onPaginate}
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
