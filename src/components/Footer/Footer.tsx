import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {

  return (
    <footer className={styles.footer}>
            <p className={styles.footerText}>
              © {new Date().getFullYear()} EnergyInsights. All rights reserved.
            </p>
            <nav className={styles.footerNav}>
              <Link className={styles.footerLink} to="#">
                Terms of Service
              </Link>
              <Link className={styles.footerLink} to="#">
                Privacy
              </Link>
            </nav>
          </footer>
  );

};
export default Footer;