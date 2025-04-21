import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Zap, TrendingUp, Shield, BarChart, LineChart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button/Button';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={`${styles.shape} ${styles.shape1}`}></div>
          <div className={`${styles.shape} ${styles.shape2}`}></div>
          <div className={`${styles.shape} ${styles.shape3}`}></div>
        </div>
        
        <h1 className={styles.heading}>
          Transform Your Energy Data into <span className={styles.highlight}>Actionable Insights</span>
        </h1>
        
        <p className={styles.subheading}>
          Monitor, analyze, and optimize energy consumption patterns with our comprehensive dashboard solution.
        </p>
        
        <div className={styles.ctaButtons}>
          <Button 
            size="large" 
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            size="large" 
            onClick={() => navigate('/features')}
          >
            Learn More
          </Button>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <BarChart3 size={24} />
            </div>
            <h3 className={styles.featureTitle}>Real-time Monitoring</h3>
            <p className={styles.featureDescription}>
              Track energy usage in real-time across multiple locations and devices to identify consumption patterns.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <TrendingUp size={24} />
            </div>
            <h3 className={styles.featureTitle}>Predictive Analytics</h3>
            <p className={styles.featureDescription}>
              Leverage advanced algorithms to predict future energy consumption and optimize usage accordingly.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Zap size={24} />
            </div>
            <h3 className={styles.featureTitle}>Cost Optimization</h3>
            <p className={styles.featureDescription}>
              Identify opportunities to reduce energy costs through data-driven insights and recommendations.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Shield size={24} />
            </div>
            <h3 className={styles.featureTitle}>Compliance Reporting</h3>
            <p className={styles.featureDescription}>
              Generate comprehensive reports for regulatory compliance and sustainability initiatives.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2 className={styles.testimonialsHeading}>Trusted by Energy Professionals</h2>
        
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "EnergyInsight has transformed how we manage our utility data. We've reduced energy costs by 23% in just six months."
            </p>
            <div className={styles.testimonialAuthor}>
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Sarah Johnson" 
                className={styles.authorAvatar} 
              />
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Sarah Johnson</span>
                <span className={styles.authorRole}>Facility Manager</span>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "The insights we get from the dashboard have been invaluable for our sustainability reporting and regulatory compliance."
            </p>
            <div className={styles.testimonialAuthor}>
              <img 
                src="https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Michael Chen" 
                className={styles.authorAvatar} 
              />
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Michael Chen</span>
                <span className={styles.authorRole}>Sustainability Director</span>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "We've implemented the recommendations from EnergyInsight across our portfolio and have seen significant efficiency gains."
            </p>
            <div className={styles.testimonialAuthor}>
              <img 
                src="https://images.pexels.com/photos/5080171/pexels-photo-5080171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Emma Rodriguez" 
                className={styles.authorAvatar} 
              />
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Emma Rodriguez</span>
                <span className={styles.authorRole}>Energy Analyst</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaHeading}>Ready to Optimize Your Energy Management?</h2>
        <p className={styles.ctaSubheading}>
          Join thousands of companies using our platform to reduce costs and improve sustainability.
        </p>
        <button className={styles.ctaButton} onClick={handleGetStarted}>
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default Home;