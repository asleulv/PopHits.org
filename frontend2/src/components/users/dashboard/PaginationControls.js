import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;
  
  return (
    <nav className="mt-8 flex justify-center items-center gap-1">
      {/* 1. Left Button - Thinner Border, No Shadow */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 border-2 border-black bg-white disabled:opacity-10 hover:bg-amber-400 transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      {/* 2. Page Indicator - Transparent/Bone instead of Solid Black */}
      <div className="px-6 py-2 border-y-2 border-black bg-white flex flex-col items-center min-w-[120px]">
        <span className="text-[9px] font-black text-black/30 uppercase tracking-[0.3em] leading-none mb-1">
          Archive Index
        </span>
        <span className="font-cherry font-black italic uppercase text-sm tracking-tighter text-black leading-none">
          {currentPage} <span className="text-black/20 mx-1">/</span> {totalPages}
        </span>
      </div>

      {/* 3. Right Button - Thinner Border, No Shadow */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 border-2 border-black bg-white disabled:opacity-10 hover:bg-amber-400 transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}