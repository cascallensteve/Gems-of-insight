import React, { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import './BlogPage.css';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogs = await blogService.getAllBlogs();
      
      // Transform API data to match component expectations
      const transformedBlogs = blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.description,
        image: getRandomImage(), // Use random image since API doesn't provide images
        category: getCategoryFromTags(blog.tags),
        date: blog.timestamp,
        author: blogService.getAuthorName(blog.author),
        readTime: blog.read_time,
        tags: blog.tags || [],
        body: blog.body
      }));
      
      setBlogPosts(transformedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get random image
  const getRandomImage = () => {
    const images = [
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Helper function to determine category from tags
  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return 'health';
    
    const healthTags = ['health', 'nutrition', 'wellness', 'exercise', 'god', 'relationships'];
    const hasHealthTag = tags.some(tag => 
      healthTags.includes(tag.toLowerCase())
    );
    
    return hasHealthTag ? 'health' : 'products';
  };

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
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="blog-page">
      <div className="container">
        {/* Header */}
        <div className="blog-header">
          <h1 className="blog-title">Health & Wellness Blog</h1>
          <p className="blog-subtitle">Latest updates on health, wellness, and new product arrivals</p>
          {loading && <div className="loading-spinner">Loading blogs...</div>}
          {error && (
            <div className="error-message">
              <p>Error loading blogs: {error}</p>
              <button onClick={fetchBlogs} className="retry-btn">Try Again</button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        {!loading && !error && (
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
        )}

        {/* Featured Post */}
        {!loading && !error && filteredPosts.length > 0 && (
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
        {!loading && !error && (
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
        )}

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
        {!loading && !error && filteredPosts.length === 0 && (
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
