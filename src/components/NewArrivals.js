import React, { useState } from 'react';
import './NewArrivals.css';

const NewArrivals = ({ onNavigateToShop }) => {
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: "Premium Organic Green Tea Collection",
      price: "$24.99",
      originalPrice: "$34.99",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      description: "Hand-picked organic green tea leaves from high-altitude gardens. Rich in antioxidants, promotes metabolism, and supports heart health naturally.",
      badge: "🌿 Organic",
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      name: "Himalayan Herbal Wellness Mix",
      price: "$18.50",
      originalPrice: "$25.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      description: "Ancient Himalayan blend of 12 powerful herbs. Boosts immunity, reduces stress, and enhances overall vitality for modern living.",
      badge: "⭐ Best Seller",
      rating: 4.9,
      inStock: true
    },
    {
      id: 3,
      name: "Raw Manuka Honey - Pure Gold",
      price: "$32.00",
      originalPrice: "$42.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      description: "Genuine Manuka honey with MGO 400+. Natural antibacterial properties, supports digestive health, and boosts immune system effectively.",
      badge: "🍯 Premium",
      rating: 4.7,
      inStock: true
    },
    {
      id: 4,
      name: "Complete Wellness Starter Kit",
      price: "$45.99",
      originalPrice: "$65.00",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      description: "Everything you need to start your natural wellness journey. Includes superfoods, probiotics, and essential vitamins for optimal health.",
      badge: "🎁 Bundle Deal",
      rating: 4.6,
      inStock: true
    }
  ];

  const handleAddToCart = (product) => {
    setCartNotification({ show: true, productName: product.name });
    setTimeout(() => {
      setCartNotification({ show: false, productName: '' });
    }, 3000);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const closeProductView = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="new-arrivals">
      <div className="section-header">
        <h2 className="section-title">New Arrivals</h2>
        <p className="section-subtitle">Discover our latest natural wellness products</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              
              {/* Product Badge */}
              <div className="product-badge">{product.badge}</div>
              
              {/* Stock Status */}
              {product.inStock && (
                <div className="stock-indicator">✅ In Stock</div>
              )}
              
              {/* Product Actions - Always visible */}
              <div className="product-actions">
                <button 
                  className="action-btn add-to-cart" 
                  onClick={() => handleAddToCart(product)}
                  title="Add to Cart"
                >
                  +
                </button>
                <button 
                  className="action-btn favorite" 
                  title="Add to Favorites"
                >
                  ❤️
                </button>
                <button 
                  className="action-btn view-product" 
                  onClick={() => handleViewProduct(product)}
                  title="View Product"
                >
                  👁️
                </button>
              </div>

              {/* Product Info - Always visible */}
              <div className="product-overlay">
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-number">({product.rating})</span>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-pricing">
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="discount">
                      Save {Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shop More Button */}
      <div className="shop-more-section">
        <button 
          className="shop-more-btn"
          onClick={() => onNavigateToShop && onNavigateToShop()}
        >
          Shop More Products
          <span className="arrow">→</span>
        </button>
      </div>

      {/* Cart Notification */}
      {cartNotification.show && (
        <div className="cart-notification">
          <div className="notification-content">
            <p>✅ {cartNotification.productName} added to cart!</p>
            <button className="view-cart-btn">View Cart</button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductView}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeProductView}>×</button>
            <div className="modal-content">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <div className="modal-info">
                <h3>{selectedProduct.name}</h3>
                <p className="modal-price">{selectedProduct.price}</p>
                <p className="modal-description">{selectedProduct.description}</p>
                <div className="modal-actions">
                  <button 
                    className="modal-add-to-cart"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    + Add to Cart
                  </button>
                  <button className="modal-favorite">❤️ Favorite</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
