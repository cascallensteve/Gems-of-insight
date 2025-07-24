import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = ({ onSearch, categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, category: selectedCategory });
  };

  const defaultCategories = [
    'All Categories',
    'Anti-Inflammatory',
    'Digestive Health', 
    'Immune Support',
    'Skin & Wound Care',
    'Stress & Anxiety',
    'Pain Management',
    'Cardiovascular',
    'Sleep & Relaxation',
    'Urinary Health',
    'Brain Health',
    'Detox & Cleanse',
    'Spices & Seasonings',
    'Superfoods',
    'Natural Flavoring'
  ];

  const categoryList = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-header">
          <h2 className="search-title">Find Your Perfect Natural Remedy</h2>
          <p className="search-subtitle">Search through our organic collection</p>
        </div>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for products, remedies, herbs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categoryList.map((category, index) => (
                <option key={index} value={category.toLowerCase().replace(' ', '-')}>
                  {category}
                </option>
              ))}
            </select>
            
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>

        <div className="popular-searches">
          <span className="popular-label">Popular Searches:</span>
          <div className="popular-tags">
            {['Turmeric', 'Ashwagandha', 'Echinacea', 'Ginkgo', 'Milk Thistle'].map((tag, index) => (
              <button 
                key={index} 
                className="popular-tag"
                onClick={() => setSearchTerm(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
