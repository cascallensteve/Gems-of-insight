import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LogoutPage.css';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setShowConfirmation(false);
    
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      logout();
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setShowConfirmation(true);
    }
  };

  const handleCancelLogout = () => {
    navigate(-1); // Go back to previous page
  };

  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!currentUser && !isLoggingOut) {
      navigate('/login');
    }
  }, [currentUser, navigate, isLoggingOut]);

  return (
    <div className="logout-page">
      <div className="logout-container">
        <div className="logout-card">
          {showConfirmation ? (
            <>
              <div className="logout-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h1 className="logout-title">Ready to Leave?</h1>
              
              <p className="logout-message">
                Hi <span className="user-name">{currentUser?.firstName || currentUser?.name || 'User'}</span>! 
                Are you sure you want to logout? You'll need to login again to access your account and continue shopping.
              </p>

              <div className="logout-actions">
                <button 
                  className="btn-confirm-logout"
                  onClick={handleConfirmLogout}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Yes, Logout
                </button>
                
                <button 
                  className="btn-cancel-logout"
                  onClick={handleCancelLogout}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="logout-processing">
              <div className="logout-spinner">
                <div className="spinner"></div>
              </div>
              
              <h2 className="logout-processing-title">Logging you out...</h2>
              <p className="logout-processing-message">
                Thank you for visiting Gems of Insight! See you again soon.
              </p>
              
              <div className="logout-success-animation">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className="check-path" d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
