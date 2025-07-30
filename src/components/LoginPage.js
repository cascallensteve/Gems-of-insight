import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import '../styles/forms.css';
// import apiService from '../services/api'; // Commented out as it's not used currently
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onLogin, onClose }) => {
  // const navigate = useNavigate(); // Commented out as it's not used currently
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Get current time for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const timeOfDay = getTimeOfDay();
  const greeting = `Good ${timeOfDay}!`;

  // Check for reset token in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setAuthMode('reset');
      setFormData(prev => ({ ...prev, resetToken: token }));
    }
  }, []);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (authMode !== 'reset') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    if (authMode === 'login' || authMode === 'reset') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (authMode === 'signup') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.terms) {
        newErrors.terms = 'You must accept the terms';
      }
    }

    if (authMode === 'reset') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    return newErrors;
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      let url, payload;

      switch (authMode) {
        case 'login':
          url = 'https://gems-of-truth.vercel.app/login';
          payload = {
            email: formData.email.trim(),
            password: formData.password
          };
          break;

        case 'signup':
          url = 'https://gems-of-truth.vercel.app/signUp';
          payload = {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            email: formData.email.trim(),
            password: formData.password
          };
          break;

        case 'forgot':
          url = 'https://gems-of-truth.vercel.app/forgot-password';
          payload = {
            email: formData.email.trim()
          };
          break;

        case 'reset':
          url = 'https://gems-of-truth.vercel.app/reset-password';
          payload = {
            token: formData.resetToken,
            password: formData.password,
            confirm_password: formData.confirmPassword
          };
          break;

        default:
          throw new Error('Invalid authentication mode');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.email) {
          throw new Error(data.email[0]);
        }
        if (data.email_verification_required) {
          window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
          return;
        }
        throw new Error(data.detail || data.message || 'Operation failed');
      }

      // Handle successful responses
      switch (authMode) {
        case 'login':
          // Use AuthContext login function
          login(data, data.token || data.access_token);
          showSuccessMessage(`Welcome back! Redirecting to home page...`);
          
          setTimeout(() => {
            if (onLogin) onLogin(data);
            if (onClose) onClose();
            else {
              // Direct redirect to home page
              window.location.href = '/';
            }
          }, 1000);
          break;

        case 'signup':
          localStorage.setItem('justSignedUp', 'true');
          showSuccessMessage('Account created successfully! OTP sent to your email for verification.');
          
          setTimeout(() => {
            window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
          }, 2000);
          break;

        case 'forgot':
          showSuccessMessage('Password reset link sent to your email. Please check your inbox.');
          
          setTimeout(() => {
            setAuthMode('login');
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              resetToken: '',
              terms: false
            });
          }, 3000);
          break;

        case 'reset':
          showSuccessMessage('Password reset successful! You can now login with your new password.');
          
          setTimeout(() => {
            setAuthMode('login');
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              resetToken: '',
              terms: false
            });
          }, 2000);
          break;
      }

    } catch (error) {
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      resetToken: authMode === 'reset' ? formData.resetToken : '',
      terms: false
    });
    setErrors({});
    setSuccessMessage('');
    setShowSuccess(false);
  };

  const handleBack = () => {
    window.history.back();
  };

  const getFormTitle = () => {
    switch (authMode) {
      case 'login':
        return `${greeting} Welcome Back!`;
      case 'signup':
        return 'Create Your Account';
      case 'forgot':
        return 'Reset Your Password';
      case 'reset':
        return 'Set New Password';
      default:
        return 'Welcome';
    }
  };

  const getFormSubtitle = () => {
    switch (authMode) {
      case 'login':
        return 'Login to continue your wellness journey';
      case 'signup':
        return 'Sign up to begin your natural health transformation';
      case 'forgot':
        return 'Enter your email to receive a password reset link';
      case 'reset':
        return 'Enter your new password below';
      default:
        return '';
    }
  };

  const getSubmitButtonText = () => {
    if (loading) {
      switch (authMode) {
        case 'login':
          return 'Logging in...';
        case 'signup':
          return 'Creating Account...';
        case 'forgot':
          return 'Sending Reset Link...';
        case 'reset':
          return 'Resetting Password...';
        default:
          return 'Processing...';
      }
    }

    switch (authMode) {
      case 'login':
        return 'Login';
      case 'signup':
        return 'Sign Up';
      case 'forgot':
        return 'Send Reset Link';
      case 'reset':
        return 'Reset Password';
      default:
        return 'Submit';
    }
  };

  return (
    <div className="login-page">
      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <div className="login-container">
        <button className="back-button" onClick={handleBack}>← Back</button>

        <div className="login-logo">
          <img
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753272258/Gems_of_insight_logo_ghxcbv.png"
            alt="Gems of Insight"
            className="logo-image"
          />
        </div>

        <div className="login-content">
          {authMode === 'signup' && (
            <div className="login-image-section">
              <div className="image-overlay">
                <h3>Start Your Wellness Journey</h3>
                <p>Join thousands who trust us for their natural health needs</p>
              </div>
            </div>
          )}

          <div className="login-form-section">
            <div className="form-header">
              <h1>{getFormTitle()}</h1>
              <p>{getFormSubtitle()}</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Signup Fields */}
              {authMode === 'signup' && (
                <>
                  <div className="form-group half">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      required
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>

                  <div className="form-group half">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      required
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>
                </>
              )}

              {/* Email Field (for login, signup, forgot password) */}
              {authMode !== 'reset' && (
                <div className="form-group with-icon">
                  <label>Email Address</label>
                  <div className="form-icon">📧</div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    required
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
              )}

              {/* Password Field (for login, signup, reset) */}
              {authMode !== 'forgot' && (
                <div className="form-group with-icon">
                  <label>Password</label>
                  <div className="form-icon">🔒</div>
                  <input
                    type="password"
                    name="password"
                    placeholder={authMode === 'reset' ? 'Enter your new password' : 'Enter your password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    required
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
              )}

              {/* Confirm Password Field (for signup and reset) */}
              {(authMode === 'signup' || authMode === 'reset') && (
                <div className="form-group with-icon">
                  <label>Confirm Password</label>
                  <div className="form-icon">🔒</div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    required
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
              )}

              {/* Terms Checkbox (for signup only) */}
              {authMode === 'signup' && (
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className={errors.terms ? 'error' : ''}
                  />
                  <label htmlFor="terms">
                    I agree to the <button type="button" className="terms-link">Terms & Conditions</button>
                  </label>
                  {errors.terms && <div className="error-message">{errors.terms}</div>}
                </div>
              )}

              {/* Forgot Password Link (for login only) */}
              {authMode === 'login' && (
                <div className="login-options">
                  <div></div>
                  <button 
                    type="button"
                    className="forgot-password-link"
                    onClick={() => switchAuthMode('forgot')}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

              <button 
                type="submit" 
                className={`form-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {getSubmitButtonText()}
              </button>
            </form>

            {/* Auth Mode Toggle Links */}
            <div className="form-footer">
              {authMode === 'login' && (
                <p>
                  Don't have an account? 
                  <button 
                    className="toggle-auth" 
                    onClick={() => switchAuthMode('signup')}
                  >
                    Sign Up
                  </button>
                </p>
              )}

              {authMode === 'signup' && (
                <p>
                  Already have an account? 
                  <button 
                    className="toggle-auth" 
                    onClick={() => switchAuthMode('login')}
                  >
                    Login
                  </button>
                </p>
              )}

              {authMode === 'forgot' && (
                <p>
                  Remember your password? 
                  <button 
                    className="toggle-auth" 
                    onClick={() => switchAuthMode('login')}
                  >
                    Back to Login
                  </button>
                </p>
              )}

              {authMode === 'reset' && (
                <p>
                  Want to login instead? 
                  <button 
                    className="toggle-auth" 
                    onClick={() => switchAuthMode('login')}
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;