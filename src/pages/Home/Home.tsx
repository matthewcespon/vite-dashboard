import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Zap,
  TrendingUp,
  Shield,
  BarChart,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Home.module.css";
import layoutStyles from "../../layout.module.css";

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  return (
    <div className={`${layoutStyles.flexCol} ${layoutStyles.minHScreen}`}>
      {/* <Navbar /> */}
      <main className={layoutStyles.flex1}>
        <section className={styles.heroSection}>
          <div
            className={`${layoutStyles.container} ${layoutStyles.px4} ${layoutStyles.mdPx6}`}
          >
            <div
              className={`${layoutStyles.lgGridCols2} ${layoutStyles.xlGridCols2}`}
            >
              <div
                className={`${layoutStyles.flexCol} ${layoutStyles.justifyCenter} ${layoutStyles.spaceY4}`}
              >
                <div className={layoutStyles.spaceY2}>
                  <h1 className={styles.heroTitle}>
                    Transform Your Energy Data into Actionable Insights
                  </h1>
                  <p className={styles.heroSubtext}>
                    Monitor, analyze, and optimize energy consumption patterns
                    with our comprehensive dashboard solution
                  </p>
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.primaryButton}
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </button>
                </div>
              </div>
              <div
                className={`${layoutStyles.flexCol} ${layoutStyles.itemsCenter} ${layoutStyles.justifyCenter}`}
              >
                <div className={styles.imageContainer}>
                  {/* <Image
                    src="/placeholder.svg?height=500&width=600"
                    alt="Energy Dashboard"
                    fill
                    className="object-contain"
                    priority
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.featuresSection}>
          <div
            className={`${layoutStyles.container} ${layoutStyles.px4} ${layoutStyles.mdPx6}`}
          >
            <div
              className={`${layoutStyles.flexCol} ${layoutStyles.itemsCenter} ${layoutStyles.justifyCenter} ${layoutStyles.spaceY4} ${layoutStyles.textCenter}`}
            >
              <div className={layoutStyles.spaceY2}>
                <h2 className={styles.featuresTitle}>Key Features</h2>
                <p className={styles.featuresSubtext}>
                  Our platform provides everything you need to understand and
                  optimize your energy usage
                </p>
              </div>
            </div>
            <div
              className={`${layoutStyles.mxAuto} ${layoutStyles.grid} ${layoutStyles.maxW5xl} ${layoutStyles.itemsCenter} ${layoutStyles.gap6} ${layoutStyles.py12} ${layoutStyles.lgGridCols3} ${layoutStyles.lgGap12}`}
            >
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <BarChart3 className={styles.featureIconSvg} />
                </div>
                <div className={layoutStyles.spaceY2}>
                  <h3 className={styles.featureTitle}>Real-time Monitoring</h3>
                  <p className={styles.featureDescription}>
                    Track energy consumption in real-time with intuitive
                    dashboards and alerts
                  </p>
                </div>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <LineChart className={styles.featureIconSvg} />
                </div>
                <div className={layoutStyles.spaceY2}>
                  <h3 className={styles.featureTitle}>Advanced Analytics</h3>
                  <p className={styles.featureDescription}>
                    Gain insights through detailed analysis and predictive
                    modeling of energy patterns
                  </p>
                </div>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Zap className={styles.featureIconSvg} />
                </div>
                <div className={layoutStyles.spaceY2}>
                  <h3 className={styles.featureTitle}>Optimization Tools</h3>
                  <p className={styles.featureDescription}>
                    Identify opportunities to reduce consumption and lower costs
                    with AI-powered recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} EnergyIQ. All rights reserved.
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
    </div>
  );
};

export default Home;
