interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center gap-[8px] my-[10px]">
      <div className="flex items-center justify-center gap-[8px] flex-wrap max-w-full">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-[10px] py-[6px] rounded-[5px] text-[12px] font-medium bg-[var(--color-dark-surface)] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`min-w-[30px] px-[8px] py-[6px] rounded-[5px] text-[12px] font-medium transition ${
              pageNumber === currentPage
                ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]"
                : "bg-[var(--color-dark-surface)] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)]"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-[10px] py-[6px] rounded-[5px] text-[12px] font-medium bg-[var(--color-dark-surface)] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>
      <div className="text-[12px] text-[rgba(245,237,214,0.35)] text-center">
        Showing {startItem}–{endItem} of {totalItems}
      </div>
    </div>
  );
}
