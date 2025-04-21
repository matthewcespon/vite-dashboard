import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';
// import styles from './navbar2.module.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.navbar} `}>
      <Link to="/" className={styles.logo}>
        <Zap className={styles.logoIcon} size={24} />
        <span>EnergyInsight</span>
      </Link>

      <button className={styles.menuButton} onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        <Link to="/" className={styles.navLink} onClick={handleNavLinkClick}>
          Home
        </Link>
        <Link to="/features" className={styles.navLink} onClick={handleNavLinkClick}>
          Features
        </Link>
        <Link to="/pricing" className={styles.navLink} onClick={handleNavLinkClick}>
          Pricing
        </Link>
        
        <div className={styles.authLinks}>
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={styles.signupButton} 
                onClick={handleNavLinkClick}
              >
                Dashboard
              </Link>
              <button 
                className={styles.profileButton} 
                onClick={handleLogout}
              >
                <div className={styles.avatar}>
                  {user.name.charAt(0)}
                </div>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={styles.loginButton} 
                onClick={handleNavLinkClick}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={styles.signupButton} 
                onClick={handleNavLinkClick}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );

};

export default Navbar;