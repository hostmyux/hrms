
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showControls?: boolean;
  showEdges?: boolean;
  className?: string;
}

export function Pagination({ 
  totalPages, 
  currentPage, 
  onPageChange,
  showControls = true,
  showEdges = false,
  className
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More complex pagination with ellipses
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(-1); // Represents ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push(-1);
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <nav 
      role="navigation" 
      aria-label="pagination" 
      className={cn("flex items-center gap-1", className)}
    >
      {showControls && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {showEdges && currentPage > 2 && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          className="hidden sm:flex"
          aria-label="Go to first page"
        >
          1
        </Button>
      )}
      
      {getPageNumbers().map((pageNumber, index) => 
        pageNumber === -1 ? (
          <div key={`ellipsis-${index}`} className="px-2">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
          </div>
        ) : (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(pageNumber)}
            className="h-8 w-8"
            aria-label={`Go to page ${pageNumber}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
          >
            {pageNumber}
          </Button>
        )
      )}
      
      {showEdges && currentPage < totalPages - 1 && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          className="hidden sm:flex"
          aria-label="Go to last page"
        >
          {totalPages}
        </Button>
      )}
      
      {showControls && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}

// Helper function
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
