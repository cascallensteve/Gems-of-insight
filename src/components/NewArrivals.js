import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import './NewArrivals.css';

const NewArrivals = ({ onNavigateToShop }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
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
      name: "Capsules - Pure ",
      price: "KSh 500",
      originalPrice: "KSh 1,200",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753871838/capsules_twqx2t.webp",
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
    if (!currentUser) {
      // Show login prompt if user is not logged in
      if (window.confirm('Please login to add items to cart. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }

    // Add to cart if user is logged in
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price, // Keep original price format
      image: product.image,
      quantity: 1
    };
    
    addToCart(cartItem);
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
              <LazyLoad height={200} offset={100} placeholder={<div className="image-placeholder">Loading...</div>}>
                <img src={product.image} alt={product.name} />
              </LazyLoad>
              
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={favorites.includes(product.id) ? "#ef4444" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
            <p>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', color: '#22c55e'}}>
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartNotification.productName} added to cart!
            </p>
            <button className="view-cart-btn" onClick={() => navigate('/cart')}>View Cart</button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductView}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeProductView}>×</button>
            <div className="modal-content">
              <LazyLoad height={300} offset={50}>
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </LazyLoad>
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
                  <button className="modal-favorite">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Favorite
                  </button>
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
