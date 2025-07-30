import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Spam protection
    if (honeypot) return;
    
    if (email) {
      // In a real app, this would make an API call
      console.log('Newsletter subscription:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="newsletter"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Get Discount 30% Off</h2>
            <p className="newsletter-subtitle">
              It is a long established fact that a reader will be distracted by the readable 
              content of natural health tips, exclusive offers, and wellness insights delivered to your inbox.
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
                  
                  {/* Honeypot field for spam protection */}
                  <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                  aria-label="Leave this field empty if you're human"
                />
                
                <p className="newsletter-privacy">
                  Leave this field empty if you're human: We respect your privacy. Unsubscribe at any time.
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
    </motion.section>
  );
};

export default Newsletter;
