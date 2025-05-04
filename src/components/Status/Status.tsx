import React from 'react';
import styles from './Status.module.css';

interface StatusProps {
  status: string;
  className?: string;
}

const Status: React.FC<StatusProps> = ({ status, className }) => {
  const getStatusClass = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') return styles.approved;
    if (statusLower === 'pending approval' || statusLower === 'pending') return styles.pendingApproval;
    if (statusLower === 'rejected') return styles.rejected;
    if (statusLower === 'draft') return styles.draft;
    return '';
  };

  return (
    <span className={`${styles.statusBadge} ${getStatusClass(status)} ${className || ''}`}>
      {status}
    </span>
  );
};

export default Status;