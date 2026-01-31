import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-12 mb-8">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-surface-highlight disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-surface-highlight/30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all border ${
                currentPage === page
                  ? "bg-primary text-background-dark border-primary shadow-lg shadow-primary/20 scale-110"
                  : "text-text-secondary hover:text-white hover:bg-surface-highlight border-surface-highlight/30"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-surface-highlight disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-surface-highlight/30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
