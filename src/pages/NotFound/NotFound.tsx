import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Page Not Found</h2>
      <p className={styles.description}>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link to="/" className={styles.button}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;