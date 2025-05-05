import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Navbar.module.css";
import Button from "../Button/Button";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.navbar} `}>
      <Link to="/" className={styles.logo} prefetch="render">
        <Zap className={styles.logoIcon} size={24} />
        <span>EnergyInsight</span>
      </Link>

      <button className={styles.menuButton} onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
        <Link 
          to="/" 
          className={styles.navLink} 
          onClick={handleNavLinkClick}
          prefetch="render"
        >
          Home
        </Link>
        {user ? (
          <>
            <Link
              to="/reports"
              className={styles.navLink}
              onClick={handleNavLinkClick}
              prefetch="intent"
            >
              Reports
            </Link>
            <Link
              to="/insights"
              className={styles.navLink}
              onClick={handleNavLinkClick}
              prefetch="intent"
            >
              Insights
            </Link>
            <Link
              to="/dashboard"
              className={styles.signupButton}
              onClick={handleNavLinkClick}
              prefetch="intent"
            >
              Dashboard
            </Link>
            <Button variant="text" size="small" onClick={handleLogout}>
              <div className={styles.avatar}>{user.name.charAt(0)}</div>
              <span className={styles.logoutButton}>Logout</span>
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={styles.loginButton}
              onClick={handleNavLinkClick}
              prefetch="intent"
            >
              Login
            </Link>
            <Link
              to="/register"
              className={styles.signupButton}
              onClick={handleNavLinkClick}
              prefetch="intent"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
