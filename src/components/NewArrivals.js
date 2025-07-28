import React, { useState } from 'react';
import './NewArrivals.css';

const NewArrivals = ({ onNavigateToShop }) => {
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const products = [
    {
      id: 1,
      name: "Premium Organic Green Tea Collection",
      price: "KSh 2,499",
      originalPrice: "KSh 3,499",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      description: "Hand-picked organic green tea leaves from high-altitude gardens. Rich in antioxidants, promotes metabolism, and supports heart health naturally.",
      badge: "🌿 Organic",
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      name: "Himalayan Herbal Wellness Mix",
      price: "KSh 1,850",
      originalPrice: "KSh 2,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      description: "Ancient Himalayan blend of 12 powerful herbs. Boosts immunity, reduces stress, and enhances overall vitality for modern living.",
      badge: "⭐ Best Seller",
      rating: 4.9,
      inStock: true
    },
    {
      id: 3,
      name: "Raw Manuka Honey - Pure Gold",
      price: "KSh 3,200",
      originalPrice: "KSh 4,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      description: "Genuine Manuka honey with MGO 400+. Natural antibacterial properties, supports digestive health, and boosts immune system effectively.",
      badge: "🍯 Premium",
      rating: 4.7,
      inStock: true
    },
    {
      id: 4,
      name: "Complete Wellness Starter Kit",
      price: "KSh 4,599",
      originalPrice: "KSh 6,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      description: "Everything you need to start your natural wellness journey. Includes superfoods, probiotics, and essential vitamins for optimal health.",
      badge: "🎁 Bundle Deal",
      rating: 4.6,
      inStock: true
    },
    {
      id: 5,
      name: "Organic Turmeric Root Powder",
      price: "KSh 1,299",
      originalPrice: "KSh 1,799",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      description: "Pure turmeric powder with high curcumin content. Natural anti-inflammatory properties, supports joint health and immune system.",
      badge: "🌿 Organic",
      rating: 4.5,
      inStock: true
    },
    {
      id: 6,
      name: "Moringa Leaf Capsules - 60ct",
      price: "KSh 2,150",
      originalPrice: null,
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      description: "Nutrient-dense moringa capsules packed with vitamins, minerals, and antioxidants. Boosts energy and supports overall wellness.",
      badge: "💊 New",
      rating: 4.8,
      inStock: true
    },
    {
      id: 7,
      name: "Cold-Pressed Coconut Oil",
      price: "KSh 899",
      originalPrice: "KSh 1,299",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      description: "Virgin coconut oil extracted using cold-press method. Perfect for cooking, skincare, and hair care routines.",
      badge: "🥥 Pure",
      rating: 4.6,
      inStock: true
    },
    {
      id: 8,
      name: "Herbal Detox Tea Blend",
      price: "KSh 1,650",
      originalPrice: "KSh 2,100",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      description: "Natural detox tea blend with dandelion, milk thistle, and green tea. Supports liver health and natural cleansing.",
      badge: "🌿 Detox",
      rating: 4.4,
      inStock: true
    }
  ];

  const handleAddToCart = (product) => {
    setCartNotification({ show: true, productName: product.name });
    setTimeout(() => {
      setCartNotification({ show: false, productName: '' });
    }, 3000);
  };

  const handleToggleFavorite = (product) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(product.id);
      if (isFavorite) {
        return prev.filter(id => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
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
            {/* Product Image */}
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              
              {/* Product Badge - Only if sale */}
              {product.originalPrice && (
                <div className="sale-badge">Sale!</div>
              )}
              
              {/* Product Actions - Show on hover */}
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
                  onClick={() => handleToggleFavorite(product)}
                  title="Add to Favorites"
                >
                  ❤️
                </button>
              </div>
            </div>

            {/* Product Info Below Image */}
            <div className="product-info">
              <h3 className="product-title">{product.name}</h3>
              
              <div className="product-pricing">
                {product.originalPrice && (
                  <span className="original-price">{product.originalPrice}</span>
                )}
                <span className="current-price">{product.price}</span>
              </div>
              
              <div className="product-category">Health & Wellness</div>
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
