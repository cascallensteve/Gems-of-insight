import React, { useState } from 'react';
import './BlogPage.css';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: "10 Natural Remedies for Better Sleep",
      excerpt: "Discover time-tested natural solutions to improve your sleep quality without medication.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      category: "health",
      date: "2024-01-20",
      author: "Dr. Sarah Mitchell",
      readTime: "5 min read",
      tags: ["Sleep", "Natural Remedies", "Wellness"]
    },
    {
      id: 2,
      title: "New Organic Superfood Supplements Now Available",
      excerpt: "Introducing our latest collection of certified organic superfood supplements for optimal nutrition.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "products",
      date: "2024-01-18",
      author: "Product Team",
      readTime: "3 min read",
      tags: ["New Products", "Superfoods", "Nutrition"]
    },
    {
      id: 3,
      title: "The Benefits of Mediterranean Diet",
      excerpt: "Learn how the Mediterranean diet can transform your health and longevity.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "health",
      date: "2024-01-15",
      author: "Dr. James Chen",
      readTime: "7 min read",
      tags: ["Diet", "Mediterranean", "Nutrition"]
    },
    {
      id: 4,
      title: "Seasonal Product Update: Winter Wellness Collection",
      excerpt: "Stay healthy this winter with our specially curated collection of immune-boosting products.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      category: "products",
      date: "2024-01-12",
      author: "Product Team",
      readTime: "4 min read",
      tags: ["Seasonal", "Immune Support", "Winter"]
    },
    {
      id: 5,
      title: "Managing Stress with Natural Herbs",
      excerpt: "Explore effective herbal solutions for managing daily stress and anxiety naturally.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "health",
      date: "2024-01-10",
      author: "Dr. Emily Rodriguez",
      readTime: "6 min read",
      tags: ["Stress Management", "Herbs", "Mental Health"]
    },
    {
      id: 6,
      title: "Product Spotlight: Organic Green Tea Collection",
      excerpt: "Discover the health benefits and varieties in our premium organic green tea collection.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "products",
      date: "2024-01-08",
      author: "Product Team",
      readTime: "4 min read",
      tags: ["Green Tea", "Antioxidants", "Product Spotlight"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'health', name: 'Health Updates', count: blogPosts.filter(post => post.category === 'health').length },
    { id: 'products', name: 'Product News', count: blogPosts.filter(post => post.category === 'products').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="blog-page">
      <div className="container">
        {/* Header */}
        <div className="blog-header">
          <h1 className="blog-title">Health & Wellness Blog</h1>
          <p className="blog-subtitle">Latest updates on health, wellness, and new product arrivals</p>
        </div>

        {/* Search and Filter */}
        <div className="blog-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="featured-post">
            <div className="featured-image">
              <img src={filteredPosts[0].image} alt={filteredPosts[0].title} />
              <div className="category-tag featured-tag">
                {filteredPosts[0].category === 'health' ? 'Health Update' : 'Product News'}
              </div>
            </div>
            <div className="featured-content">
              <h2 className="featured-title">{filteredPosts[0].title}</h2>
              <p className="featured-excerpt">{filteredPosts[0].excerpt}</p>
              <div className="post-meta">
                <span className="author">By {filteredPosts[0].author}</span>
                <span className="date">{formatDate(filteredPosts[0].date)}</span>
                <span className="read-time">{filteredPosts[0].readTime}</span>
              </div>
              <div className="post-tags">
                {filteredPosts[0].tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <button className="read-more-btn">Read Full Article</button>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="blog-grid">
          {filteredPosts.slice(1).map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <div className="category-tag">
                  {post.category === 'health' ? 'Health Update' : 'Product News'}
                </div>
              </div>
              <div className="blog-content">
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span className="author">By {post.author}</span>
                  <span className="date">{formatDate(post.date)}</span>
                </div>
                <div className="blog-footer">
                  <div className="post-tags">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <span className="read-time">{post.readTime}</span>
                </div>
                <button className="read-more-btn">Read More</button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Get the latest health tips and product updates delivered to your inbox</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="no-results">
            <h3>No articles found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
