import React from 'react';
import './BlogSection.css';

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Natural Remedies for Better Sleep",
      excerpt: "Discover ancient herbal remedies that can help you achieve deeper, more restful sleep without synthetic medications.",
      date: "January 15, 2024",
      author: "Dr. Sarah Williams",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Sleep Health"
    },
    {
      id: 2,
      title: "Turmeric: The Golden Healer",
      excerpt: "Learn about the powerful anti-inflammatory properties of turmeric and how to incorporate it into your daily wellness routine.",
      date: "January 12, 2024",
      author: "Mark Thompson",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Herbal Medicine"
    },
    {
      id: 3,
      title: "Boost Your Immunity Naturally",
      excerpt: "Strengthen your immune system with these proven natural methods and herbal supplements for year-round protection.",
      date: "January 10, 2024",
      author: "Dr. Michael Chen",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Immune Support"
    }
  ];

  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="blog-header">
          <h2 className="blog-title">Latest Health Insights</h2>
          <p className="blog-subtitle">Expert advice and natural healing wisdom from our wellness community</p>
        </div>

        <div className="blog-grid">
          {blogPosts.map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <div className="blog-category">{post.category}</div>
              </div>
              
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-author">By {post.author}</span>
                </div>
                
                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                
                <button className="blog-read-more">
                  Read More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-footer">
          <button className="view-all-posts">View All Posts</button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
