import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Pagination as PaginationType } from "@/lib/interfaces";

interface PaginationProps extends PaginationType {
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, page - halfVisible);
      let end = Math.min(totalPages - 1, page + halfVisible);

      // Adjust if we're near the start
      if (page <= halfVisible + 1) {
        end = maxVisiblePages - 1;
      }
      // Adjust if we're near the end
      if (page >= totalPages - halfVisible) {
        start = totalPages - maxVisiblePages + 2;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Calculate the correct start and end items for the current page
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground w-max">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <Pagination className="w-max">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className={
                page === 1 || totalItems <= pageSize
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>

          {getPageNumbers().map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={() => onPageChange(pageNum as number)}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              className={
                page === totalPages || totalItems <= pageSize
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
