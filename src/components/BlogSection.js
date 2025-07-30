import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import './BlogSection.css';

const BlogSection = () => {
  const navigate = useNavigate();
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const blogPosts = [
    {
      id: 1,
      title: "10 Benefits of Organic Turmeric for Daily Wellness",
      excerpt: "Discover how incorporating organic turmeric into your daily routine can boost immunity, reduce inflammation, and improve overall health.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      date: "January 15, 2025",
      author: "Dr. Sarah Williams",
      category: "Natural Remedies",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Complete Guide to Natural Detox Methods",
      excerpt: "Learn about gentle, effective ways to support your body's natural detoxification process using organic herbs and lifestyle changes.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      date: "January 12, 2025",
      author: "Mark Johnson",
      category: "Detox & Cleanse",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Building Immunity Naturally: A Holistic Approach",
      excerpt: "Strengthen your immune system with proven natural methods, superfoods, and lifestyle practices that promote long-term health.",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      date: "January 10, 2025",
      author: "Dr. Emily Chen",
      category: "Immunity",
      readTime: "6 min read"
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleReadMore = (postId) => {
    navigate(`/blog`);
  };

  return (
    <motion.section 
      ref={ref}
      className="blog-section"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Latest Posts</h2>
          <p>Stay informed with our latest insights on natural health and wellness</p>
        </motion.div>

        <motion.div className="blog-grid" variants={containerVariants}>
          {blogPosts.map((post) => (
            <motion.article 
              key={post.id} 
              className="blog-card"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <div className="blog-category">{post.category}</div>
              </div>

              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-separator">•</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>

                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>

                <div className="blog-footer">
                  <div className="blog-author">
                    <span>By {post.author}</span>
                  </div>
                  <button 
                    className="read-more-btn"
                    onClick={() => handleReadMore(post.id)}
                  >
                    Read More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div className="blog-cta" variants={itemVariants}>
          <button 
            className="view-all-blog-btn"
            onClick={() => navigate('/blog')}
          >
            View All Blog Posts
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BlogSection;
