import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Shop.css';

const Shop = ({ allProducts, bestSellers, onQuickView, onProductView, onSearch }) => {
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(allProducts || []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All Categories',
    'Anti-Inflammatory',
    'Digestive Health',
    'Immune Support',
    'Stress & Anxiety',
    'Pain Management',
    'Cardiovascular',
    'Sleep & Relaxation',
    'Urinary Health',
    'Brain Health',
    'Detox & Cleanse',
    'Skin & Wound Care'
  ];

  const priceRanges = [
    { label: 'All Prices', value: 'all', min: 0, max: Infinity },
    { label: 'Under KSH 1,500', value: 'under-1500', min: 0, max: 1500 },
    { label: 'KSH 1,500 - 2,000', value: '1500-2000', min: 1500, max: 2000 },
    { label: 'KSH 2,000 - 2,500', value: '2000-2500', min: 2000, max: 2500 },
    { label: 'Over KSH 2,500', value: 'over-2500', min: 2500, max: Infinity }
  ];

  useEffect(() => {
    let filtered = allProducts || [];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.replace(' ', '-').toLowerCase() ||
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.diseases?.some(disease => disease.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const range = priceRanges.find(r => r.value === priceRange);
      if (range) {
        filtered = filtered.filter(product => {
          const price = parseFloat(product.price.replace(',', ''));
          return price >= range.min && price <= range.max;
        });
      }
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace(',', '')) - parseFloat(b.price.replace(',', ''));
        case 'price-high':
          return parseFloat(b.price.replace(',', '')) - parseFloat(a.price.replace(',', ''));
        case 'rating':
          return (b.rating || 4.0) - (a.rating || 4.0);
        case 'popularity':
          return (b.sold || Math.floor(Math.random() * 100)) - (a.sold || Math.floor(Math.random() * 100));
        case 'newest':
          return new Date(b.dateAdded || new Date()) - new Date(a.dateAdded || new Date());
        case 'name':
          return a.name.localeCompare(b.name);
        case 'default':
        default:
          return (b.featured || Math.random()) - (a.featured || Math.random());
      }
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, priceRange, sortBy, searchTerm, allProducts]);

  return (
    <section className="shop-section">
      <div className="shop-container">
        <div className="shop-header">
          <h1 className="shop-title">Gems of Insight Shop</h1>
          <p className="shop-subtitle">Discover healing solutions for every health condition</p>
        </div>

        {/* Best Sellers Section */}
        {bestSellers && bestSellers.length > 0 && (
          <div className="best-sellers-section">
            <h2 className="section-title">Best Selling Products</h2>
            <div className="best-sellers-grid">
              {bestSellers.slice(0, 4).map((product) => (
                <div key={product.id} className="best-seller-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-badge">⭐ Best Seller</div>
                    <div className="product-actions">
                      <button 
                        className="action-btn quick-view"
                        onClick={() => onQuickView && onQuickView(product)}
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn add-to-cart"
                        onClick={() => addToCart(product)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">KSH {product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="shop-filters">
          <div className="filters-top">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search remedies, diseases, or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shop-search"
              />
            </div>
            
            <div className="view-controls">
              <button 
                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button 
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="6" width="18" height="2"/>
                  <rect x="3" y="10" width="18" height="2"/>
                  <rect x="3" y="14" width="18" height="2"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="filters-bottom">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((category, index) => (
                <option key={index} value={category === 'All Categories' ? 'all' : category}>
                  {category}
                </option>
              ))}
            </select>

            <select 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              className="filter-select"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="default">Default (Featured)</option>
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>

            <div className="results-count">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        <div className={`shop-products ${viewMode}`}>
          {filteredProducts.map(product => (
            <div key={product.id} className={`shop-product-card ${viewMode}`}>
              {product.sale && <span className="sale-badge">Sale!</span>}
              
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-overlay">
                  <button 
                    className="quick-view-btn"
                    onClick={() => onQuickView && onQuickView(product)}
                  >
                    Quick View
                  </button>
                  <button 
                    className="full-view-btn"
                    onClick={() => onProductView && onProductView(product)}
                  >
                    Full Details
                  </button>
                </div>
              </div>

              <div className="product-details">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}

                {product.diseases && (
                  <div className="product-diseases">
                    <span className="diseases-label">Treats:</span>
                    <div className="diseases-tags">
                      {product.diseases.slice(0, 3).map((disease, index) => (
                        <span key={index} className="disease-tag">{disease}</span>
                      ))}
                      {product.diseases.length > 3 && (
                        <span className="disease-tag more">+{product.diseases.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="product-price">
                  {product.originalPrice && (
                    <span className="original-price">KSH {product.originalPrice}</span>
                  )}
                  <span className="current-price">KSH {product.price}</span>
                </div>

                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;
