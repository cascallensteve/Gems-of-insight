import React from 'react';
import './DealOfTheWeek.css';

const DealOfTheWeek = ({ onQuickView, onProductView }) => {
  const weeklyDeal = {
    id: 1,
    name: "European Lemon Zest",
    category: "Chickpea",
    price: "15.00",
    originalPrice: "20.00",
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
    discount: "25% OFF",
    description: "Premium European lemon zest with natural oils and intense flavor. Perfect for cooking and natural remedies."
  };

  return (
    <section className="deal-of-the-week">
      <div className="container">
        <div className="section-header">
          <h2>Deal Of The Week</h2>
        </div>
        
        <div className="deal-card">
          <div className="deal-image">
            <img src={weeklyDeal.image} alt={weeklyDeal.name} />
            <div className="discount-badge">{weeklyDeal.discount}</div>
          </div>
          
          <div className="deal-content">
            <div className="product-category">{weeklyDeal.category}</div>
            <h3 className="product-name">{weeklyDeal.name}</h3>
            <p className="product-description">{weeklyDeal.description}</p>
            
            <div className="product-price">
              <span className="current-price">${weeklyDeal.price}</span>
              <span className="original-price">${weeklyDeal.originalPrice}</span>
            </div>
            
            <div className="action-buttons">
              <button 
                className="add-to-cart-btn"
              >
                Add to Cart
              </button>
              <button 
                className="quick-view-btn"
                onClick={() => onQuickView && onQuickView(weeklyDeal)}
              >
                Quick View
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheWeek;
