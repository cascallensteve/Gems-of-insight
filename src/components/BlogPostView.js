import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../services/blogService';
import LikeButton from './LikeButton';
import LoadingDots from './LoadingDots';
import './BlogPostView.css';

const BlogPostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (postId) {
      loadBlogPost();
      loadComments();
    }
  }, [postId]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      // For now, we'll simulate getting a single blog post
      // In a real app, you'd have an API endpoint like blogService.getBlogById(postId)
      const allBlogs = await blogService.getAllBlogs();
      const foundPost = allBlogs.find(blog => blog.id.toString() === postId);
      
      if (foundPost) {
        const transformedPost = {
          id: foundPost.id,
          title: foundPost.title,
          excerpt: foundPost.description,
          image: getRandomImage(),
          category: getCategoryFromTags(foundPost.tags),
          date: foundPost.timestamp,
          author: blogService.getAuthorName(foundPost.author),
          readTime: foundPost.read_time,
          tags: foundPost.tags || [],
          body: foundPost.body,
          likes: foundPost.likes || 0,
          isLiked: foundPost.isLiked || false
        };
        setPost(transformedPost);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      // Load comments from localStorage for now
      // In a real app, you'd fetch from API: blogService.getComments(postId)
      const storedComments = localStorage.getItem(`comments_${postId}`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      
      // Create new comment object
      const comment = {
        id: Date.now(),
        postId: postId,
        author: 'Anonymous User', // In a real app, get from user context
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: []
      };

      // Add comment to state
      const updatedComments = [comment, ...comments];
      setComments(updatedComments);

      // Save to localStorage (in real app, save to API)
      localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));

      // Clear form
      setNewComment('');
      
      alert('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = (commentId) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleReplyToComment = (commentId) => {
    const replyContent = prompt('Enter your reply:');
    if (replyContent && replyContent.trim()) {
      const reply = {
        id: Date.now(),
        author: 'Anonymous User',
        content: replyContent.trim(),
        timestamp: new Date().toISOString(),
        likes: 0
      };

      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        )
      );
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getRandomImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return 'general';
    const tag = tags[0].toLowerCase();
    if (tag.includes('health') || tag.includes('wellness')) return 'health';
    if (tag.includes('product') || tag.includes('new')) return 'products';
    return 'general';
  };

  if (loading) {
    return (
      <div className="blog-post-view">
        <div className="container">
          <LoadingDots text="Loading blog post..." size="large" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-view">
        <div className="container">
          <div className="error-state">
            <h2>Error</h2>
            <p>{error || 'Blog post not found'}</p>
            <button onClick={() => navigate('/blog')} className="back-btn">
              ← Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-view">
      <div className="container">
        {/* Back Button */}
        <button onClick={() => navigate('/blog')} className="back-btn">
          ← Back to Blog
        </button>

        {/* Blog Post Content */}
        <article className="blog-post">
          <header className="post-header">
            <div className="post-meta">
              <span className="category-tag">{post.category}</span>
              <span className="date">{formatDate(post.date)}</span>
              <span className="read-time">{post.readTime}</span>
            </div>
            <h1 className="post-title">{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>
            <div className="author-info">
              <span className="author">By {post.author}</span>
            </div>
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </header>

          <div className="post-image">
            <img src={post.image} alt={post.title} />
          </div>

          <div className="post-content">
            <div className="content-body">
              {post.body ? (
                post.body.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>Content not available</p>
              )}
            </div>
          </div>

          <footer className="post-footer">
            <LikeButton 
              blogId={post.id}
              initialLikes={post.likes}
              initialIsLiked={post.isLiked}
              size="large"
            />
            <div className="share-buttons">
              <button className="share-btn" onClick={() => navigator.share({ title: post.title, url: window.location.href })}>
                📤 Share
              </button>
            </div>
          </footer>
        </article>

        {/* Comments Section */}
        <section className="comments-section">
          <h2 className="comments-title">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <div className="form-group">
              <label htmlFor="comment">Add a comment:</label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this article..."
                rows="4"
                required
              />
            </div>
            <button 
              type="submit" 
              className="submit-comment-btn"
              disabled={submittingComment}
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-date">{formatDate(comment.timestamp)}</span>
                  </div>
                  <div className="comment-content">
                    {comment.content}
                  </div>
                  <div className="comment-actions">
                    <button 
                      onClick={() => handleLikeComment(comment.id)}
                      className="like-btn"
                    >
                      👍 {comment.likes}
                    </button>
                    <button 
                      onClick={() => handleReplyToComment(comment.id)}
                      className="reply-btn"
                    >
                      💬 Reply
                    </button>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="reply">
                          <div className="reply-header">
                            <span className="reply-author">{reply.author}</span>
                            <span className="reply-date">{formatDate(reply.timestamp)}</span>
                          </div>
                          <div className="reply-content">
                            {reply.content}
                          </div>
                          <div className="reply-actions">
                            <button 
                              onClick={() => handleLikeComment(reply.id)}
                              className="like-btn"
                            >
                              👍 {reply.likes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Posts */}
        <section className="related-posts">
          <h2>Related Articles</h2>
          <div className="related-grid">
            {/* In a real app, you'd fetch related posts based on tags/category */}
            <div className="related-post">
              <h3>More Health Tips</h3>
              <p>Discover more ways to improve your health and wellness...</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPostView;
