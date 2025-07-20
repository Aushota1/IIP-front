import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser, fetchUserProfile } from '../api';
import { useUser } from '../context/UserContext';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Логинимся и сохраняем токен (axios интерцептор добавит Authorization)
      await loginUser(formData);

      // Проверяем, что токен действительно есть в localStorage
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token not found. Login failed.");

      // Получаем профиль пользователя (токен будет автоматически добавлен в заголовок)
      const profile = await fetchUserProfile();

      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      navigate('/profile');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Login failed. Please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="smooth-auth-page">
      <div className="smooth-auth-container">
        <div className="smooth-auth-header">
          <h2>Welcome Back</h2>
          <p>Continue your journey with us</p>
        </div>

        {successMessage && (
          <div className="smooth-success-message">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="smooth-error-message">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M13 13H11V7H13M13 17H11V15H13M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2Z" />
            </svg>
            {error}
          </div>
        )}

        <form className="smooth-auth-form" onSubmit={handleSubmit}>
          <div className="smooth-input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={error && !validateEmail(formData.email) ? 'smooth-input-error' : ''}
            />
            <label>Email Address</label>
            <span className="smooth-input-border"></span>
            <div className="smooth-input-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
              </svg>
            </div>
          </div>
          
          <div className="smooth-input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={error && formData.password.length < 6 ? 'smooth-input-error' : ''}
            />
            <label>Password</label>
            <span className="smooth-input-border"></span>
            <div className="smooth-input-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15S13.1 17 12 17M18 20V10H6V20H18M18 8C19.1 8 20 8.9 20 10V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V10C4 8.9 4.9 8 6 8H7V6C7 3.2 9.2 1 12 1S17 3.2 17 6V8H18M12 3C10.3 3 9 4.3 9 6V8H15V6C15 4.3 13.7 3 12 3Z" />
              </svg>
            </div>
            <button
              type="button"
              className="smooth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 9C13.7 9 15 10.3 15 12S13.7 15 12 15 9 13.7 9 12 10.3 9 12 9M12 4.5C17 4.5 21.3 7.6 23 12C21.3 16.4 17 19.5 12 19.5S2.7 16.4 1 12C2.7 7.6 7 4.5 12 4.5M3.2 12C4.8 15 8.1 17 12 17S19.2 15 20.8 12C19.2 9 15.9 7 12 7S4.8 9 3.2 12Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M2 5.3L3.3 4L20 20.7L18.7 22L15.3 18.6C14.1 19.3 13 19.7 12 20C7.6 20 3.5 16.9 1.4 12C2.1 10.6 3.1 9.2 4.2 8L2 5.3M12 9C13.7 9 15 10.3 15 12C15 12.3 14.9 12.6 14.8 12.9L11.1 9.2C11.4 9.1 11.7 9 12 9M12 4.5C17 4.5 21.3 7.6 23 12C22.4 13.4 21.5 14.7 20.4 15.8L18.7 14.1C19.5 13.4 20.1 12.5 20.6 11.6C19.1 8.8 15.8 7 12 7C10.9 7 9.8 7.2 8.8 7.5L7.2 5.9C8.7 5.2 10.3 4.8 12 4.5M9.5 6.6L12 4.5C17 4.5 21.3 7.6 23 12C22.3 13.4 21.3 14.7 20.2 15.8L18.5 14.1C19.3 13.3 19.9 12.4 20.4 11.5C18.9 8.7 15.6 7 12 7C11.1 7 10.2 7.1 9.3 7.3L9.5 6.6Z" />
                </svg>
              )}
            </button>
          </div>

          <div className="smooth-form-options">
            <Link to="/forgot-password" className="smooth-forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            className={`smooth-submit-btn ${isHovered ? 'smooth-btn-hover' : ''}`}
            disabled={isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isLoading ? (
              <>
                <span className="smooth-spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
            <span className="smooth-btn-wave"></span>
          </button>
        </form>
        
        <div className="smooth-auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
