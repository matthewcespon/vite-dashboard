import Footer from "../../components/Footer/Footer";
import EnergyTable from "../../components/EnergyTable/EnergyTable";
import styles from "./Energy.module.css";

const Energy: React.FC = () => {

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Energy Data</h1>
          <p className={styles.subtitle}>
            Monitor and analyze energy consumption patterns across different sectors and locations.
          </p>
        </div>
        
        <div className={styles.tableContainer}>
          <EnergyTable height={600} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Energy;