// Blog API Service
const API_BASE_URL = 'https://gems-of-truth.vercel.app';

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  return token;
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found. Please login.');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }
    
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const blogService = {
  // Fetch all blogs
  getAllBlogs: async () => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/all-blogs`, {
        method: 'GET',
      });
      return data.blogs || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Get single blog details
  getBlogById: async (blogId) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/blog-detail/${blogId}/`, {
        method: 'GET',
      });
      return data.blog;
    } catch (error) {
      console.error('Error fetching blog details:', error);
      throw error;
    }
  },

  // Add new blog
  addBlog: async (blogData) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/add-blog`, {
        method: 'POST',
        body: JSON.stringify(blogData),
      });
      return data.blog;
    } catch (error) {
      console.error('Error adding blog:', error);
      throw error;
    }
  },

  // Edit existing blog
  editBlog: async (blogId, blogData) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/edit-blog/${blogId}/`, {
        method: 'POST',
        body: JSON.stringify(blogData),
      });
      return data.blog;
    } catch (error) {
      console.error('Error editing blog:', error);
      throw error;
    }
  },

  // Validate blog data before sending
  validateBlogData: (blogData) => {
    const required = ['title', 'description', 'body', 'read_time', 'tag_list'];
    const missing = required.filter(field => !blogData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return true;
  },

  // Format blog data for API
  formatBlogData: (formData) => {
    return {
      title: formData.title?.trim() || '',
      description: formData.description?.trim() || '',
      body: formData.body?.trim() || '',
      read_time: formData.read_time?.trim() || '',
      tag_list: Array.isArray(formData.tags) 
        ? formData.tags.join(' ')
        : formData.tag_list?.trim() || '',
    };
  },

  // Parse tags from tag_list string
  parseTags: (tagList) => {
    if (!tagList) return [];
    return tagList.split(' ').filter(tag => tag.trim() !== '');
  },

  // Format timestamp for display
  formatTimestamp: (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  },

  // Get author display name
  getAuthorName: (author) => {
    if (!author) return 'Anonymous';
    return `${author.first_name || ''} ${author.last_name || ''}`.trim() || author.email || 'Anonymous';
  },

  // Check if user can edit blog (for future use)
  canEditBlog: (blog, currentUser) => {
    if (!currentUser) return false;
    if (!blog.author) return false;
    return blog.author.id === currentUser.id;
  }
};

export default blogService;
