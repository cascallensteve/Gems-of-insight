import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [yearsCount, setYearsCount] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const targetYears = 5;
    const duration = 2000; // 2 seconds
    const increment = targetYears / (duration / 50);
    
    const timer = setInterval(() => {
      setYearsCount(prev => {
        if (prev >= targetYears) {
          clearInterval(timer);
          return targetYears;
        }
        return Math.min(prev + increment, targetYears);
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const phrases = ['Stay Healthy\nShop Online', 'Live Better\nFeel Great', 'With Gems of Insight\nShop Now!'];
    const currentText = phrases[currentPhase];
    
    if (currentPhase < phrases.length && currentText) {
      let i = 0;
      setTypedText('');
      
      const typing = setInterval(() => {
        if (i < currentText.length) {
          setTypedText(currentText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typing);
          // Move to next phrase after a delay
          setTimeout(() => {
            setCurrentPhase(prev => (prev + 1) % phrases.length);
          }, 2000);
        }
      }, 100);

      return () => clearInterval(typing);
    }
  }, [currentPhase]);

  return (
    <section className="hero">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="floating-element herb-1">🌿</div>
        <div className="floating-element herb-2">🍃</div>
        <div className="floating-element herb-3">🌱</div>
        <div className="floating-element remedy-1">🌱</div>
        <div className="floating-element remedy-2">🧪</div>
        <div className="floating-element remedy-3">🌱</div>
      </div>

      {/* Three Hero Sections */}
      <div className="hero-three-sections">
        <div className="hero-card main-welcome-card animate-slide-left">
          <div className="card-image">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg" 
              alt="Natural Healing Products"
            />
            <div className="card-badge">50% OFF</div>
            <div className="main-card-overlay-content">
              <div className="typed-text-container animate-slide-down">
                <div className="typed-text" style={{whiteSpace: 'pre-line'}}>{typedText}<span className="cursor">|</span></div>
              </div>
              <button 
                className="happy-shop-button animate-bounce-in"
                onClick={() => window.location.href = '/shop'}
              >
                Shop <span className="swinging-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hero-card right-card animate-slide-right">
          <div className="card-image">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg"
              alt="Fresh Exotic Fruit"
            />
            <div className="card-badge">🌱</div>
            <div className="nature-quote animate-quote-right">
              "Before there were drugs, there was nature."
            </div>
            <div className="animated-leaves">
              <div className="leaf leaf-1">🌿</div>
              <div className="leaf leaf-2">🍃</div>
              <div className="leaf leaf-3">🌱</div>
              <div className="leaf leaf-4">🌿</div>
            </div>

            <div className="card-overlay-content animate-text-bottom">
              <h3>fresh exotic fruit</h3>
              <p className="product-description">By any Natural Disease Remedy from us.</p>
              <button className="card-overlay-button simple-view-btn">
                Start Now
              </button>
            </div>
          </div>
        </div>

        <div className="hero-card right-card animate-slide-right-delay">
          <div className="card-image">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1753445611/pregnant-woman-receiving-bottle-pills-from-specialist-cure-disease-healthcare-physician-giving-prescription-treatment-medicine-patient-with-pregnancy-medical-office_qxkcps.jpg"
              alt="Healthy Food"
            />
            <div className="card-badge">50% OFF</div>
            <div className="animated-leaves">
              <div className="leaf leaf-5">🌿</div>
              <div className="leaf leaf-6">🍃</div>
              <div className="leaf leaf-7">🌱</div>
              <div className="leaf leaf-8">🌿</div>
            </div>

            <div className="card-overlay-content animate-text-bottom-delay">
              <h3>Seek For Medical Consultation</h3>
              <p className="product-description">Professional Natural Wellness Specialists are here to help you.</p>
              <button className="card-overlay-button simple-view-btn">
                Book Here
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
