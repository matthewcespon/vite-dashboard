import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemName = 'items'
}) => {
  return (
    <div className={styles.paginationControls}>
      <div className={styles.paginationInfo}>
        Showing page {currentPage} of {totalPages} ({totalItems} {itemName} total)
      </div>
      <div className={styles.paginationButtons}>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        
        {/* Generate page number buttons */}
        {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => page === 1 || page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1))
          .map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${styles.paginationButton} ${currentPage === page ? styles.activeButton : ''}`}
            >
              {page}
            </button>
          ))
        }
        
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;