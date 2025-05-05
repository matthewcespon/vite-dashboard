import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Banner from '../../components/Banner/Banner';
import EnergySavingsMetrics from '../../components/EnergySavingsMetrics/EnergySavingsMetrics';
import EnergyChart from '../../components/EnergyChart/EnergyChart';
import RecentReports from '../../components/RecentReports/RecentReports';
import styles from './Dashboard.module.css';
import Footer from '../../components/Footer/Footer';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  
  useEffect(() => {
    // Check if the user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Show success message if user just logged in
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      setShowSuccessMessage(true);
      
      // Remove the query parameter from the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [user, navigate]);
  
  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className={styles.container}>
      {showSuccessMessage && (
        <Banner 
          type="success"
          message={`Welcome back, ${user.name}! You've successfully logged in.`}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.greeting}>Hello, {user.name}</h1>
          <p className={styles.subtitle}>Welcome to your Energy Insights Dashboard</p>
          
          <EnergySavingsMetrics />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <EnergyChart title="Energy Consumption Trends" />
        </div>
        
        <RecentReports />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;