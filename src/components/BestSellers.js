import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import './BestSellers.css';

const BestSellers = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const products = [
    {
      id: 'bs1',
      name: "Organic Turmeric Powder",
      price: "KSh 1,299",
      originalPrice: "KSh 1,799",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Spices & Herbs",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller"
    },
    {
      id: 'bs2',
      name: "Raw Manuka Honey",
      price: "KSh 3,200",
      originalPrice: "KSh 4,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      category: "Natural Sweeteners",
      rating: 4.9,
      reviews: 89,
      badge: "Premium"
    },
    {
      id: 'bs3',
      name: "Himalayan Pink Salt",
      price: "KSh 850",
      originalPrice: "KSh 1,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Salts & Minerals",
      rating: 4.7,
      reviews: 156,
      badge: "Sale"
    },
    {
      id: 'bs4',
      name: "Organic Coconut Oil",
      price: "KSh 1,450",
      originalPrice: "KSh 1,899",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "Healthy Oils",
      rating: 4.6,
      reviews: 203,
      badge: "Popular"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      if (window.confirm('Please login to add items to cart. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    };
    
    addToCart(cartItem);
    setCartNotification({ show: true, productName: product.name });
    setTimeout(() => {
      setCartNotification({ show: false, productName: '' });
    }, 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  return (
    <motion.section 
      ref={ref}
      className="best-sellers"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Best Selling Products</h2>
          <p>Our customers' most loved natural health products</p>
        </motion.div>

        <motion.div className="products-grid" variants={containerVariants}>
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              className="product-card"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="product-image">
                <LazyLoad height={250} offset={100} placeholder={<div className="image-placeholder">Loading...</div>}>
                  <img src={product.image} alt={product.name} />
                </LazyLoad>
                <div className="product-badge">{product.badge}</div>
                <div className="product-overlay">
                  <button 
                    className="quick-add-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>

              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                
                <div className="product-rating">
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-text">({product.reviews})</span>
                </div>

                <div className="product-pricing">
                  <span className="current-price">{product.price}</span>
                  <span className="original-price">{product.originalPrice}</span>
                </div>

                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="view-all-section" variants={itemVariants}>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/shop')}
          >
            View All Products
          </button>
        </motion.div>
      </div>

      {/* Cart Notification */}
      {cartNotification.show && (
        <div className="cart-notification">
          <div className="notification-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{cartNotification.productName} added to cart!</span>
            <button onClick={() => navigate('/cart')}>View Cart</button>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default BestSellers;
