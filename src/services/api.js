import axios from "axios";

const api = axios.create({
  baseURL: "https://gems-of-truth.vercel.app",
  withCredentials: false, // Changed to false to fix CORS issue
});

// Authentication helper methods
const apiService = {
  // Get user data from localStorage
  getUserData: () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Set user data in localStorage
  setUserData: (userData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data:', error);
      throw error;
    }
  },

  // Set authentication token
  setAuthToken: (token) => {
    try {
      if (token) {
        localStorage.setItem('token', token);
        // Set the token in axios headers for future requests (Django REST Framework format)
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
      throw error;
    }
  },

  // Clear authentication data
  clearAuth: () => {
    try {
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      // Remove the token from axios headers
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error clearing auth:', error);
      throw error;
    }
  },

  // Get stored token
  getAuthToken: () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Authentication endpoints
  auth: {
    // Sign up
    signUp: async (userData) => {
      try {
        const response = await api.post('/signUp', userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Verify email
    verifyEmail: async (email, otp) => {
      try {
        const response = await api.post('/verify-email', { email, otp });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Resend verification OTP
    resendVerificationOTP: async (email) => {
      try {
        const response = await api.post('/resend-verification-otp', { email });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Login
    login: async (email, password) => {
      try {
        const response = await api.post('/login', { email, password });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Forgot password
    forgotPassword: async (email) => {
      try {
        const response = await api.post('/forgot-password', { email });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Reset password
    resetPassword: async (email, token, newPassword) => {
      try {
        const response = await api.post('/reset-password', {
          email,
          token,
          new_password: newPassword
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Admin sign up
    adminSignUp: async (adminData) => {
      try {
        const response = await api.post('/admin-signUp', adminData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Blog endpoints
  blogs: {
    // Add blog
    addBlog: async (blogData) => {
      try {
        const response = await api.post('/blogs/add-blog', blogData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Edit blog
    editBlog: async (blogId, blogData) => {
      try {
        const response = await api.post(`/blogs/edit-blog/${blogId}/`, blogData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all blogs (public endpoint - no auth required)
    getAllBlogs: async () => {
      try {
        const response = await axios.get(`${api.defaults.baseURL}/blogs/all-blogs`, {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get single blog details (public endpoint - no auth required)
    getBlogDetail: async (blogId) => {
      try {
        const response = await axios.get(`${api.defaults.baseURL}/blogs/blog-detail/${blogId}/`, {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Store endpoints
  store: {
    // Add store item
    addItem: async (itemData) => {
      try {
        const response = await api.post('/store/add-item', itemData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Edit store item
    editItem: async (itemId, itemData) => {
      try {
        const response = await api.post(`/store/edit-item/${itemId}/`, itemData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all store items
    getAllItems: async () => {
      try {
        const response = await api.get('/store/all-items');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get single store item details
    getItemDetail: async (itemId) => {
      try {
        const response = await api.get(`/store/item-detail/${itemId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all orders (admin only)
    getAllOrders: async () => {
      try {
        const response = await api.get('/store/all-orders');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all user orders (admin only)
    getAllUserOrders: async () => {
      try {
        const response = await api.get('/store/all-user-orders');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get order details
    getOrderDetail: async (orderId) => {
      try {
        const response = await api.get(`/store/order-detail/${orderId}/`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update order status (admin only)
    updateOrderStatus: async (orderId, status) => {
      try {
        const response = await api.post(`/store/update-order-status/${orderId}/`, {
          status
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Order endpoints
  orders: {
    // Create order
    createOrder: async (orderData) => {
      try {
        const response = await api.post('/orders/create', orderData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get user orders
    getUserOrders: async () => {
      try {
        const response = await api.get('/orders/user-orders');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get order details
    getOrderDetail: async (orderId) => {
      try {
        const response = await api.get(`/orders/order-detail/${orderId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Payment endpoints
  payments: {
    // Initiate M-Pesa payment
    initiateMpesaPayment: async (paymentData) => {
      try {
        const response = await api.post('/payments/mpesa/initiate', paymentData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Check payment status
    checkPaymentStatus: async (checkoutRequestId) => {
      try {
        const response = await api.get(`/payments/mpesa/status/${checkoutRequestId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // User management endpoints (for admin)
  users: {
    // Get all users (admin only)
    getAllUsers: async () => {
      try {
        const response = await api.get('/users/all-users');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get user by ID
    getUserById: async (userId) => {
      try {
        const response = await api.get(`/users/user-detail/${userId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update user (admin only)
    updateUser: async (userId, userData) => {
      try {
        const response = await api.post(`/users/update-user/${userId}`, userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete user (admin only)
    deleteUser: async (userId) => {
      try {
        const response = await api.delete(`/users/delete-user/${userId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get user statistics
    getUserStats: async () => {
      try {
        const response = await api.get('/users/stats');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  }
};

// api endpoint for the appointment view 
async function bookAppointment() {
  const data = {
    full_name: "Billy Josiah",
    email: "billy@example.com",
    phone_no: "+254712345678",
    health_concern: "Frequent headaches",
    preferred_date: "2025-08-25",
    preferred_time: "14:30:00",
    additional_notes: "Please schedule me with Dr. Smith if available"
  };

  const res = await fetch("{{baseURL}}/bookings/book-appointment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  console.log(result);
}


  // end of appointment booking  
  const fetchAppointments = async () => {
  try {
    const token = localStorage.getItem("authToken"); // example storage
    const res = await axios.get("https://gems-of-truth.vercel.app/bookings/appointment-list", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`   // ✅ standard header
        // or "Authorization": `Bearer ${token}` if using JWT
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error("Error fetching appointments:", err);
  }
};

// Initialize auth token if it exists
const token = apiService.getAuthToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
}

// Export individual functions for backward compatibility
export const createOrder = apiService.orders.createOrder;
export const getUserOrders = apiService.orders.getUserOrders;
export const initiateMpesaPayment = apiService.payments.initiateMpesaPayment;
export const checkPaymentStatus = apiService.payments.checkPaymentStatus;
export const forgotPassword = apiService.auth.forgotPassword;
export const resetPassword = apiService.auth.resetPassword;

export default apiService;
export { api };
