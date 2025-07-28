import React from 'react';
import './TrendingProducts.css';

const TrendingProducts = ({ onQuickView, onProductView }) => {
  const trendingProducts = [
    {
      id: 1,
      name: "European Lemon Zest",
      category: "Cruciferous",
      price: "15.00",
      originalPrice: "20.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg"
    },
    {
      id: 2,
      name: "Green beans – 1 Kg",
      category: "broad beans",
      price: "12.00",
      originalPrice: "18.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg"
    },
    {
      id: 3,
      name: "Fresh Organic Herbs",
      category: "Herbs",
      price: "8.00",
      originalPrice: "12.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302932/garlic-cherry-tomatoes-with-salt-shaker_hsjxnm.jpg"
    },
    {
      id: 4,
      name: "Premium Turmeric",
      category: "Spices",
      price: "25.00",
      originalPrice: "35.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302980/turmeric-powder_joex5s.jpg"
    }
  ];

  return (
    <section className="trending-products">
      <div className="container">
        <div className="section-header">
          <h2>Recently added our store</h2>
          <h3>Trending Products</h3>
        </div>
        
        <div className="products-grid">
          {trendingProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-overlay">
                  <button 
                    className="quick-view-btn"
                    onClick={() => onQuickView && onQuickView(product)}
                  >
                    Quick View
                  </button>
                </div>
              </div>
              
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h4 className="product-name">{product.name}</h4>
                <div className="product-price">
                  <span className="current-price">${product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">${product.originalPrice}</span>
                  )}
                </div>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
