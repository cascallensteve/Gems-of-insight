import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!formData.email) {
      newErrors.email = 'Email or username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.terms) {
        newErrors.terms = 'You must accept the terms';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Dummy authentication - accept any email/password for testing
    if (formData.email && formData.password) {
      setLoading(true);
      setErrors({});

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const userData = {
          id: 1,
          name: isLogin ? 'John Doe' : `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName || 'John',
          lastName: formData.lastName || 'Doe',
          email: formData.email,
          phone: formData.phone || '+254 700 000 000',
          isAdmin: formData.email.includes('admin')
        };

        // Store user data in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Call onLogin if provided, otherwise navigate
        if (onLogin) {
          onLogin(userData);
        }
        
        if (onClose) {
          onClose();
        } else {
          window.location.reload(); // Refresh to show logged in state
        }
      } catch (error) {
        setErrors({ submit: 'Something went wrong. Please try again.' });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors({ 
        email: !formData.email ? 'Email is required' : '',
        password: !formData.password ? 'Password is required' : ''
      });
    }
  };

  const handleGoogleAuth = () => {
    // Simulate Google authentication
    window.location.href = '/';
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      terms: false
    });
    setErrors({});
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        
        {/* Logo Section */}
        <div className="login-logo">
          <img 
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753272258/Gems_of_insight_logo_ghxcbv.png" 
            alt="Gems of Insight" 
            className="logo-image"
          />
        </div>

        {/* Login/Signup Form Section */}
        <div className="login-content">
          {!isLogin && (
            <div className="login-image-section">
              <img 
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1748432253/samples/two-ladies.jpg" 
                alt="Healthy Living" 
                className="healthy-image"
              />
              <div className="image-overlay">
                <h3>Start Your Wellness Journey</h3>
                <p>Join thousands who trust us for their natural health needs</p>
              </div>
            </div>
          )}

          <div className="login-form-section">
            <div className="login-header">
              <h2>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
              <p className="login-subtitle">
                {isLogin 
                  ? 'Access your account to continue your natural wellness journey with personalized recommendations and exclusive member benefits.'
                  : 'Join our wellness community to unlock premium natural products, expert consultations, and personalized health insights tailored just for you.'
                }
              </p>
              <div className="demo-info">
                <small>💡 <strong>Demo:</strong> Use any email and password to login</small>
              </div>
            </div>

            {/* Google Authentication */}
            <button 
              type="button" 
              className="google-auth-btn"
              onClick={handleGoogleAuth}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="32" height="32">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="First Name"
                      required
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Last Name"
                      required
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Phone Number (+254...)"
                    required
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              )}

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Email or Username"
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Password"
                  required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm Password"
                    required
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              )}

              {!isLogin && (
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className={errors.terms ? 'error' : ''}
                    />
                    <span className="checkmark"></span>
                    I agree to the Terms & Conditions
                  </label>
                  {errors.terms && <span className="error-text">{errors.terms}</span>}
                </div>
              )}

              {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="login-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="toggle-auth" onClick={toggleAuthMode}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
