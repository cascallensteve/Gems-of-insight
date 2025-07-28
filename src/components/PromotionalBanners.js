import React from 'react';
import './PromotionalBanners.css';

const PromotionalBanners = () => {
  return (
    <section className="promotional-banners">
      <div className="container">
        <div className="banners-grid">
          {/* Salad Promotion */}
          <div className="promo-banner salad-banner">
            <div className="banner-content">
              <div className="discount-badge">50% OFF</div>
              <h3>Enjoy Your<br />favorite Salad</h3>
              <button className="promo-button">View Products</button>
            </div>
            <div className="banner-image">
              <img 
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg" 
                alt="Fresh Salad" 
              />
            </div>
          </div>

          {/* Fresh Drinks Promotion */}
          <div className="promo-banner drinks-banner">
            <div className="banner-content">
              <div className="discount-badge">50% OFF</div>
              <h3>create fresh<br />drinks</h3>
              <button className="promo-button">View Products</button>
            </div>
            <div className="banner-image">
              <img 
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg" 
                alt="Fresh Drinks" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
