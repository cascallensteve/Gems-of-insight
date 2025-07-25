import React from 'react';
import './NewFooter.css';

const NewFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="new-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3 className="footer-logo">GemsOfInsight</h3>
            <p className="footer-tagline">Your trusted partner in natural wellness and organic living</p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Instagram">📸</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="YouTube">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#shop">Shop</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-links">
            <h4>Categories</h4>
            <ul>
              <li><a href="#supplements">Supplements</a></li>
              <li><a href="#herbs">Herbal Products</a></li>
              <li><a href="#superfoods">Superfoods</a></li>
              <li><a href="#wellness">Wellness</a></li>
              <li><a href="#new-arrivals">New Arrivals</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#returns">Returns</a></li>
              <li><a href="#track">Track Order</a></li>
              <li><a href="#support">Customer Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get health tips and exclusive offers</p>
            <div className="newsletter-signup">
              <input type="email" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <span className="icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="icon">✉️</span>
                <span>info@gemsofinsight.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {currentYear} GemsOfInsight. All rights reserved.</p>
          </div>
          <div className="footer-bottom-center">
            <div className="payment-methods">
              <span>💳</span>
              <span>🏦</span>
              <span>💎</span>
              <span>🔒</span>
            </div>
          </div>
          <div className="footer-bottom-right">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges">
          <div className="badge">
            <span className="badge-icon">🌱</span>
            <span className="badge-text">100% Organic</span>
          </div>
          <div className="badge">
            <span className="badge-icon">🚚</span>
            <span className="badge-text">Free Shipping</span>
          </div>
          <div className="badge">
            <span className="badge-icon">🔒</span>
            <span className="badge-text">Secure Payment</span>
          </div>
          <div className="badge">
            <span className="badge-icon">📞</span>
            <span className="badge-text">24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
