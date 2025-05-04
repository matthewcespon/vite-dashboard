import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!isVisible && !open) return null;

  return (
    <div className={`${styles.overlay} ${open ? styles.overlayVisible : styles.overlayHidden}`} onClick={onClose}>
      <div className={`${styles.modal} ${open ? styles.modalVisible : styles.modalHidden}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
