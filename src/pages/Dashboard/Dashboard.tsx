import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import EnergySavingsMetrics from "../../components/EnergySavingsMetrics/EnergySavingsMetrics";
import EnergyChart from "../../components/EnergyChart/EnergyChart";
import RecentReports from "../../components/RecentReports/RecentReports";
import styles from "./Dashboard.module.css";
import Footer from "../../components/Footer/Footer";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.greeting}>Hello, {user.name}</h1>
          <p className={styles.subtitle}>Welcome to your Dashboard</p>
          <EnergySavingsMetrics />
        </div>
      </div>
      <div className={styles.content}>
        <EnergyChart title="Energy Consumption Trends" />
        <RecentReports />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
