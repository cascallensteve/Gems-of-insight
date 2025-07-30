import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import './Shop.css';

const Shop = ({ allProducts, bestSellers, onQuickView, onProductView, onSearch }) => {
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(allProducts || []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubCategories, setShowSubCategories] = useState(false);

  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Herbs & Spices', value: 'herbs-spices' },
    { name: 'Extracts', value: 'extracts' },
    { name: 'Supplements', value: 'supplements' }
  ];

  const subCategories = {
    'herbs-spices': [
      'All Herbs & Spices',
      'Medicinal Herbs',
      'Culinary Herbs',
      'Spices',
      'Tea Blends'
    ],
    'extracts': [
      'All Extracts',
      'Tinctures',
      'Essential Oils',
      'Capsules',
      'Powders',
      'Liquid Extracts'
    ],
    'supplements': [
      'All Supplements',
      'Vitamins',
      'Minerals',
      'Herbal',
      'Probiotics',
      'Amino Acids',
      'Enzymes'
    ]
  };

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
      product.category.toLowerCase() === selectedCategory.toLowerCase() ||
      product.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }

  // Filter by subcategory
  if (selectedSubCategory !== 'all' && selectedSubCategory !== 'All Herbs & Spices' && 
      selectedSubCategory !== 'All Extracts' && selectedSubCategory !== 'All Supplements') {
    filtered = filtered.filter(product => 
      product.subCategory && product.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()
    );
  }

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.diseases && product.diseases.some(disease => 
          disease.toLowerCase().includes(searchLower)
        ))
      );
    });
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
}, [selectedCategory, selectedSubCategory, priceRange, sortBy, searchTerm, allProducts]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubCategory('all');
    setShowSubCategories(value !== 'all');
  };

  return (
    <section className="shop-section">
      <div className="shop-container">
        <div className="shop-header">
          <h1 className="shop-title">Gems of Insight Shop</h1>
          <p className="shop-subtitle">Premium Herbs, Extracts & Supplements for Holistic Wellness</p>
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
                    <p className="product-category-badge">{product.category}</p>
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
                placeholder="Search herbs, supplements, or health benefits..."
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
            <div className="category-filters">
              <select 
                value={selectedCategory} 
                onChange={handleCategoryChange}
                className="filter-select"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>

              {showSubCategories && (
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All {categories.find(c => c.value === selectedCategory)?.name}</option>
                  {subCategories[selectedCategory]?.map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
                </select>
              )}
            </div>

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
                <LazyLoad height={250} offset={100} placeholder={<div className="image-placeholder">Loading...</div>}>
                  <img src={product.image} alt={product.name} />
                </LazyLoad>
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
                <div className="product-category-badge">{product.category}</div>
                {product.subCategory && (
                  <div className="product-subcategory">{product.subCategory}</div>
                )}
                <h3 className="product-name">{product.name}</h3>
                
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}

                {product.benefits && (
                  <div className="product-benefits">
                    <span className="benefits-label">Key Benefits:</span>
                    <ul className="benefits-list">
                      {product.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
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
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubCategory('all');
                setPriceRange('all');
                setSearchTerm('');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;