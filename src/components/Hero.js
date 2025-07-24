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
    const phrases = ['STAY HOME', 'SHOP ONLINE'];
    const currentText = phrases[currentPhase];
    
    if (currentPhase < phrases.length) {
      let i = 0;
      setTypedText('');
      
      const typing = setInterval(() => {
        if (i < currentText.length) {
          setTypedText(prev => prev + currentText[i]);
          i++;
        } else {
          clearInterval(typing);
          // Wait 2 seconds before starting next phrase
          setTimeout(() => {
            setCurrentPhase(prev => prev + 1);
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
                <div className="typed-text">{typedText}<span className="cursor">|</span></div>
              </div>
              <div className="years-counter-circle animate-fade-in-delay">
                <div className="circle-container">
                  <div className="years-number">{Math.floor(yearsCount)}</div>
                  <div className="years-text">Years of Excellence</div>
                </div>
              </div>
              <button className="happy-shop-button animate-bounce-in">
                HAPPY SHOP NOW
              </button>
            </div>
          </div>
        </div>

        <div className="hero-card right-card animate-slide-right">
          <div className="card-image">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg" 
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
            <div className="product-actions animate-actions-slide">
              <button className="action-btn add-to-cart" title="Add to Cart">+</button>
              <button className="action-btn favorite" title="Add to Favorites">❤️</button>
              <button className="action-btn view-product" title="View Product">👁️</button>
            </div>
            <div className="card-overlay-content animate-text-bottom">
              <h3>fresh exotic fruit</h3>
              <p className="product-description">Fresh, natural, and packed with vitamins. Perfect for your healthy lifestyle.</p>
              <button className="card-overlay-button simple-view-btn">
                👁️ View
              </button>
            </div>
          </div>
        </div>

        <div className="hero-card right-card animate-slide-right-delay">
          <div className="card-image">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg" 
              alt="Healthy Food"
            />
            <div className="card-badge">50% OFF</div>
            <div className="animated-leaves">
              <div className="leaf leaf-5">🌿</div>
              <div className="leaf leaf-6">🍃</div>
              <div className="leaf leaf-7">🌱</div>
              <div className="leaf leaf-8">🌿</div>
            </div>
            <div className="product-actions animate-actions-slide-delay">
              <button className="action-btn add-to-cart" title="Add to Cart">+</button>
              <button className="action-btn favorite" title="Add to Favorites">❤️</button>
              <button className="action-btn view-product" title="View Product">👁️</button>
            </div>
            <div className="card-overlay-content animate-text-bottom-delay">
              <h3>be fitness Healthy Food</h3>
              <p className="product-description">Organic vegetables rich in nutrients. Your path to a healthier you.</p>
              <button className="card-overlay-button simple-view-btn">
                👁️ View
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
