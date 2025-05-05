import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Info } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button/Button";
import Banner from "../../components/Banner/Banner";
import styles from "./Auth.module.css";
import { Tooltip } from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      setLoginSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.bannerContainer}>
          {loginError && (
            <Banner
              type="error"
              message={loginError}
              onClose={() => setLoginError(null)}
            />
          )}
          {loginSuccess && (
            <Banner
              type="success"
              message="Login successful! Redirecting to dashboard..."
              onClose={() => setLoginSuccess(false)}
            />
          )}
          <Tooltip style={{ color: "grey" }} title="admin@admin.com:Admin123!">
            <Info size={16}></Info>
          </Tooltip>
        </div>

        <div>
          <div className={styles.header}>
            <div className={styles.logo}>
              <Zap className={styles.logoIcon} size={32} />
            </div>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.input} ${
                  validationErrors.email ? styles.error : ""
                }`}
                placeholder="youremail@example.com"
              />
            </div>
            {validationErrors.email && (
              <span className={styles.errorMessage}>
                {validationErrors.email}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${
                  validationErrors.password ? styles.error : ""
                }`}
                placeholder="••••••••"
              />
            </div>
            {validationErrors.password && (
              <span className={styles.errorMessage}>
                {validationErrors.password}
              </span>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            className={styles.submitButton}
          >
            {!isLoading ? "Log In" : <>&nbsp;</>}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account?
            <Link to="/register" className={styles.footerLink}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
