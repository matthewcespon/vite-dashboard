import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  disabled,
  className,
  ...rest
}) => {
  return (
    <button
      className={`
        ${styles.button}
        ${styles[variant]}
        ${size !== 'medium' ? styles[size] : ''}
        ${fullWidth ? styles.fullWidth : ''}
        ${loading ? styles.loading : ''}
        ${disabled ? styles.disabled : ''}
        ${className || ''}
      `}
      disabled={disabled || loading}
      {...rest}
    >
      {icon && !loading && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;