import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './Banner.module.css';

export type BannerType = 'success' | 'error' | 'warning' | 'info';

interface BannerProps {
  type: BannerType;
  message: string;
  onClose?: () => void;
}

const Banner: React.FC<BannerProps> = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`${styles.banner} ${styles[type]}`}>
      <div className={styles.content}>
        {getIcon()}
        <p className={styles.message}>{message}</p>
      </div>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Banner;