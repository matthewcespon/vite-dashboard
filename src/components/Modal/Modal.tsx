import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  
  useEffect(() => {
    if (open) {
      setIsRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!isRendered) return null;

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.overlayVisible : styles.overlayHidden}`} onClick={onClose}>
      <div className={`${styles.modal} ${isVisible ? styles.modalVisible : styles.modalHidden}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
