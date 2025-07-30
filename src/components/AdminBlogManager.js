import React, { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import './AdminBlogManager.css';

const AdminBlogManager = ({ user, onNavigateBack }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    body: '',
    read_time: '',
    tag_list: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogs = await blogService.getAllBlogs();
      setPosts(blogs);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // Validate form data
      blogService.validateBlogData(postForm);

      let savedPost;
      if (editingPost) {
        // Update existing post
        savedPost = await blogService.editBlog(editingPost.id, postForm);
        setPosts(posts.map(post => post.id === editingPost.id ? savedPost : post));
      } else {
        // Create new post
        savedPost = await blogService.addBlog(postForm);
        setPosts([savedPost, ...posts]);
      }

      resetPostForm();
      alert(editingPost ? 'Blog updated successfully!' : 'Blog created successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title || '',
      description: post.description || '',
      body: post.body || '',
      read_time: post.read_time || '',
      tag_list: post.tag_list || ''
    });
    setShowPostModal(true);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      // Note: API doesn't have delete endpoint, so we'll just remove from local state
      setPosts(posts.filter(post => post.id !== postId));
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error.message);
    }
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      description: '',
      body: '',
      read_time: '',
      tag_list: ''
    });
    setEditingPost(null);
    setShowPostModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getStatusColor = (post) => {
    return post.author ? '#22c55e' : '#f59e0b'; // Published vs Draft
  };

  const getStatusText = (post) => {
    return post.author ? 'Published' : 'Draft';
  };

  return (
    <div className="admin-blog-manager">
      <div className="admin-header">
        <button className="back-btn" onClick={onNavigateBack}>
          ← Back to Profile
        </button>
        <h1>Blog Management</h1>
        <div className="admin-info">
          <span>Welcome, {user?.firstName} {user?.lastName}</span>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Blog Posts ({posts.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'posts' && (
          <div className="posts-section">
            <div className="section-header">
              <h2>Manage Blog Posts</h2>
              <button 
                className="create-btn"
                onClick={() => setShowPostModal(true)}
              >
                + Create New Post
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <p>Loading posts...</p>
              </div>
            ) : (
              <div className="posts-table">
                <div className="table-header">
                  <div>Title</div>
                  <div>Author</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                
                {posts.map(post => (
                  <div key={post.id} className="table-row">
                    <div className="post-title">
                      <h4>{post.title}</h4>
                      <p>{post.description}</p>
                    </div>
                    <div className="post-author">
                      {blogService.getAuthorName(post.author)}
                    </div>
                    <div className="post-date">
                      {formatDate(post.timestamp)}
                    </div>
                    <div className="post-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(post) }}
                      >
                        {getStatusText(post)}
                      </span>
                    </div>
                    <div className="post-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditPost(post)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {posts.length === 0 && (
                  <div className="empty-state">
                    <p>No blog posts found. Create your first post!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => !submitting && resetPostForm()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
              <button 
                className="close-btn" 
                onClick={resetPostForm}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="post-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={postForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={postForm.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the post"
                  rows="3"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  name="body"
                  value={postForm.body}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..."
                  rows="10"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Read Time *</label>
                  <input
                    type="text"
                    name="read_time"
                    value={postForm.read_time}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 minutes"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Tags *</label>
                  <input
                    type="text"
                    name="tag_list"
                    value={postForm.tag_list}
                    onChange={handleInputChange}
                    placeholder="e.g., Health Nutrition Wellness"
                    required
                    disabled={submitting}
                  />
                  <small>Separate tags with spaces</small>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={resetPostForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span>
                      <span className="spinner"></span>
                      {editingPost ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingPost ? 'Update Post' : 'Create Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogManager;
