import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button/Button';
import Banner from '../../components/Banner/Banner';
import styles from './Auth.module.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      errors.password = 'Password must include uppercase, lowercase, number and special character';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await register({ name, email, password });
      setRegisterSuccess(true);
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.bannerContainer}>
          {registerError && (
            <Banner 
              type="error" 
              message={registerError} 
              onClose={() => setRegisterError(null)} 
            />
          )}
          {registerSuccess && (
            <Banner 
              type="success" 
              message="Registration successful! Redirecting to dashboard..." 
              onClose={() => setRegisterSuccess(false)}
            />
          )}
        </div>
        
        <div className={styles.header}>
          <div className={styles.logo}>
            <Zap className={styles.logoIcon} size={32} />
          </div>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Start your journey with EnergyInsight</p>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${styles.input} ${validationErrors.name ? styles.error : ''}`}
                placeholder="John Doe"
              />
            </div>
            {validationErrors.name && (
              <span className={styles.errorMessage}>{validationErrors.name}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.input} ${validationErrors.email ? styles.error : ''}`}
                placeholder="youremail@example.com"
              />
            </div>
            {validationErrors.email && (
              <span className={styles.errorMessage}>{validationErrors.email}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${validationErrors.password ? styles.error : ''}`}
                placeholder="••••••••"
              />
            </div>
            {validationErrors.password && (
              <span className={styles.errorMessage}>{validationErrors.password}</span>
            )}
          </div>
          
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            className={styles.submitButton}
          >
            Sign Up
          </Button>
        </form>
        
        <div className={styles.footer}>
          <p>
            Already have an account?
            <Link to="/login" className={styles.footerLink}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;