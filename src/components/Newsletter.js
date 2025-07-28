import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would make an API call
      console.log('Newsletter subscription:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Get Discount 30% Off</h2>
            <p className="newsletter-subtitle">
              Subscribe to our newsletter and receive exclusive discounts, 
              natural health tips, and early access to new remedies.
            </p>
            <div className="newsletter-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">🎁</span>
                <span>Exclusive Offers</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📚</span>
                <span>Health Tips</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <span>Early Access</span>
              </div>
            </div>
          </div>

          <div className="newsletter-form-wrapper">
            {subscribed ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Welcome to our community!</h3>
                <p>Check your email for your 30% discount code.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                    required
                  />
                  <button type="submit" className="newsletter-submit">
                    Get 30% Off
                  </button>
                </div>
                <p className="newsletter-privacy">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="newsletter-decorations">
          <div className="decoration decoration-1"></div>
          <div className="decoration decoration-2"></div>
          <div className="decoration decoration-3"></div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
