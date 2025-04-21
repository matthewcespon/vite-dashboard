import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Zap,
  LineChart,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Home.module.css";
import layoutStyles from "../../layout.module.css";
import Button from "../../components/Button/Button";
import heroStyles from "./hero.module.css";
import Footer from "../../components/Footer/Footer";

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

<section className={heroStyles.hero}>

          <div
            className={`${layoutStyles.px4} ${layoutStyles.mdPx6}`}
          >

          <div className={heroStyles.heroBackground}></div>
          <div className={heroStyles.heroPattern}></div>
          <div className={`${styles.container} ${heroStyles.heroContent}`}>
            <div className={heroStyles.heroText}>
              <h1 className={heroStyles.heroTitle}>
                Transform Your Energy Data into 
                  <span className={heroStyles.heroTitleAccent}> Actionable Insights</span>
              </h1>
              <p className={heroStyles.heroDescription}>
                    Monitor, analyze, and optimize energy consumption patterns
                    with our comprehensive dashboard solution
                  </p>
              <div className={heroStyles.heroButtons}>
                  <Button
                    className={styles.primaryButton}
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
              </div>
              <div className={heroStyles.heroFeatures}>
                <div className={heroStyles.heroFeature}>
                  <div className={heroStyles.heroFeatureDot}></div>
                  <span className={heroStyles.heroFeatureText}>Sign-up today</span>
                </div>
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
      <Footer/>
      
    </div>
  );
};

export default Home;
