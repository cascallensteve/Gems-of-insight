import React from 'react';
import './BlackFridayBanner.css';

const BlackFridayBanner = () => {
  return (
    <section className="black-friday-banner">
      <div className="container">
        <div className="banner-content">
          <div className="banner-text">
            <h2>Black Friday</h2>
            <h3>Sale 50% Off all vegetable products</h3>
            <button className="discover-button">Discover Now</button>
          </div>
          <div className="banner-image">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg" 
              alt="Fresh Vegetables" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlackFridayBanner;
