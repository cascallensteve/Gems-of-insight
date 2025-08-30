import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationPage.css';

const LocationPage = () => {
  const navigate = useNavigate();

  const handleBackToContact = () => {
    navigate('/contact');
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent('Nairobi, Kenya');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  const handleCallUs = () => {
    window.location.href = 'tel:+254794491920';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello! I would like to visit your location. Can you provide more details?');
    window.open(`https://wa.me/254794491920?text=${message}`, '_blank');
  };

  return (
    <div className="location-page">
      <div className="location-hero">
        <div className="location-hero-content">
          <button className="back-button" onClick={handleBackToContact}>
            ← Back to Contact
          </button>
          <h1>Our Location</h1>
          <p>Visit us in Nairobi for personalized wellness consultations and natural remedies</p>
        </div>
      </div>

      <div className="location-container">
        <div className="location-content">
          <div className="map-section">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819876!2d36.8176!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0OScwMy40IkU!5e0!3m2!1sen!2ske!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '15px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gems of Insight Location"
              ></iframe>
            </div>
            
            <div className="location-info">
              <h2>📍 Nairobi, Kenya</h2>
              <p>Central Business District</p>
              
              <div className="location-details">
                <div className="detail-item">
                  <span className="icon">🕒</span>
                  <div>
                    <h4>Business Hours</h4>
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <span className="icon">🚗</span>
                  <div>
                    <h4>Parking</h4>
                    <p>Free parking available on-site for customers</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <span className="icon">♿</span>
                  <div>
                    <h4>Accessibility</h4>
                    <p>Wheelchair accessible with ramp and elevator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="location-actions">
            <button className="action-btn primary" onClick={handleGetDirections}>
              🚗 Get Directions
            </button>
            <button className="action-btn secondary" onClick={handleCallUs}>
              📞 Call Us
            </button>
            <button className="action-btn whatsapp" onClick={handleWhatsApp}>
              💬 WhatsApp
            </button>
            <button className="action-btn" onClick={() => navigate('/consultation')}>
              📅 Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
