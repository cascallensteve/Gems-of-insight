import React from 'react';
import './BestSellers.css';

const BestSellers = ({ products, onQuickView, onProductView }) => {
  const bestSellingProducts = [
    {
      id: 1,
      name: "Aurore Grape",
      category: "Chickpea",
      price: "15.00",
      originalPrice: "20.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302980/turmeric-powder_joex5s.jpg"
    },
    {
      id: 2,
      name: "Organic Maize",
      category: "Cruciferous",
      price: "12.00",
      originalPrice: "18.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg"
    },
    {
      id: 3,
      name: "Fresh Broccoli",
      category: "Cruciferous",
      price: "8.00",
      originalPrice: "12.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302932/garlic-cherry-tomatoes-with-salt-shaker_hsjxnm.jpg"
    },
    {
      id: 4,
      name: "Organic Spinach",
      category: "Leafy Greens",
      price: "6.00",
      originalPrice: "9.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303607/aloe-vera-leaves-with-beauty-cream-bottle_jahbg4.jpg"
    }
  ];

  return (
    <section className="best-sellers">
      <div className="container">
        <div className="section-header">
          <h2>Best selling</h2>
          <h3>Best Sellers products</h3>
          <button className="view-all-button">View Products</button>
        </div>
        
        <div className="products-grid">
          {bestSellingProducts.map(product => (
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

export default BestSellers;
