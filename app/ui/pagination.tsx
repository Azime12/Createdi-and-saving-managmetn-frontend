"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  primaryColor?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  primaryColor = "#0ca197" 
}: PaginationProps) {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-md transition-colors ${
          currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed dark:text-gray-600' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        aria-label="Previous page"
      >
        <FiChevronLeft size={18} />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
            currentPage === page
              ? 'text-white font-medium'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          style={
            currentPage === page
              ? {
                  backgroundColor: primaryColor,
                  '--primary-hover': `${primaryColor}E6`
                }
              : {
                  '--primary-hover': `${primaryColor}10`,
                  '--primary-active': `${primaryColor}20`
                }
          }
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md transition-colors ${
          currentPage === totalPages 
            ? 'text-gray-400 cursor-not-allowed dark:text-gray-600' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        aria-label="Next page"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
}