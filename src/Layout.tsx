import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import styles from './layout.module.css';

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;