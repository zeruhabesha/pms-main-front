import React from "react";
import { CPagination, CPaginationItem } from "@coreui/react";

const PropertyTablePagination = ({
  totalPagesComputed,
  currentPage,
  handlePageChange,
  totalProperties,
}) => {
  const getPaginationRange = (currentPage, totalPages) => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 2;
    const range = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 1) {
      if (range[0] > 2) range.unshift("...");
      range.unshift(1);
    }

    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) range.push("...");
      range.push(totalPages);
    }

    return range;
  };

  return (
    totalPagesComputed > 1 && (
      <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
        <span>Total Properties: {totalProperties}</span>
        <CPagination className="d-inline-flex">
          <CPaginationItem
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(1)}
            aria-label="Go to first page"
          >
            «
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Go to previous page"
          >
            ‹
          </CPaginationItem>

          {getPaginationRange(currentPage, totalPagesComputed).map(
            (page, index) =>
              page === "..." ? (
                <CPaginationItem key={`dots-${index}`} disabled>
                  ...
                </CPaginationItem>
              ) : (
                <CPaginationItem
                  key={`page-${page}`}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </CPaginationItem>
              )
          )}

          <CPaginationItem
            disabled={currentPage >= totalPagesComputed}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Go to next page"
          >
            ›
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage >= totalPagesComputed}
            onClick={() => handlePageChange(totalPagesComputed)}
            aria-label="Go to last page"
          >
            »
          </CPaginationItem>
        </CPagination>
      </div>
    )
  );
};

export default PropertyTablePagination;
