import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './DealOfTheWeek.css';

const DealOfTheWeek = () => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProduct = {
    id: 99,
    name: "Ultimate Wellness Bundle",
    category: "Complete Health",
    price: "8,999",
    originalPrice: "14,999",
    sale: true,
    description: "Complete natural healing package with 5 powerful remedies for total body wellness",
    diseases: ["Multiple Conditions", "General Wellness", "Immune Support", "Detox", "Energy Boost"],
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    savings: "60"
  };

  return (
    <section className="deal-of-week">
      <div className="deal-container">
        <div className="deal-header">
          <h2 className="deal-title">Deal of the Week</h2>
          <div className="countdown-timer">
            <div className="time-unit">
              <span className="time-number">{timeLeft.days}</span>
              <span className="time-label">Days</span>
            </div>
            <div className="time-unit">
              <span className="time-number">{timeLeft.hours}</span>
              <span className="time-label">Hours</span>
            </div>
            <div className="time-unit">
              <span className="time-number">{timeLeft.minutes}</span>
              <span className="time-label">Minutes</span>
            </div>
            <div className="time-unit">
              <span className="time-number">{timeLeft.seconds}</span>
              <span className="time-label">Seconds</span>
            </div>
          </div>
        </div>

        <div className="deal-content">
          <div className="deal-image">
            <img src={dealProduct.image} alt={dealProduct.name} />
            <div className="deal-badge">
              <span className="savings-percent">{dealProduct.savings}% OFF</span>
              <span className="deal-label">Limited Time</span>
            </div>
          </div>

          <div className="deal-info">
            <div className="deal-category">{dealProduct.category}</div>
            <h3 className="deal-name">{dealProduct.name}</h3>
            <p className="deal-description">{dealProduct.description}</p>
            
            <div className="deal-diseases">
              <span className="diseases-label">Comprehensive Treatment For:</span>
              <div className="diseases-grid">
                {dealProduct.diseases.map((disease, index) => (
                  <span key={index} className="disease-item">{disease}</span>
                ))}
              </div>
            </div>

            <div className="deal-pricing">
              <span className="deal-original-price">KSH {dealProduct.originalPrice}</span>
              <span className="deal-current-price">KSH {dealProduct.price}</span>
              <span className="deal-savings">Save KSH {(parseFloat(dealProduct.originalPrice.replace(',', '')) - parseFloat(dealProduct.price.replace(',', ''))).toLocaleString()}</span>
            </div>

            <div className="deal-actions">
              <button 
                className="deal-add-to-cart"
                onClick={() => addToCart(dealProduct)}
              >
                Add Bundle to Cart
              </button>
              <button className="deal-learn-more">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheWeek;
