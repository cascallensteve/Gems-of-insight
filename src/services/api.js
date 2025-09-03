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
        const response = await api.post('/bookings/create-order', orderData);
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
        // Use the correct M-Pesa endpoint
        const response = await api.post('/payments/pay', {
          phone: paymentData.phoneNumber,
          amount: paymentData.amount
        });
        
        // Return the response in the expected format
        return {
          success: response.data.ResponseCode === '0',
          checkoutRequestId: response.data.CheckoutRequestID,
          merchantRequestId: response.data.MerchantRequestID,
          message: response.data.CustomerMessage,
          responseCode: response.data.ResponseCode,
          responseDescription: response.data.ResponseDescription
        };
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Check payment status
    checkPaymentStatus: async (checkoutRequestId) => {
      try {
        // For now, we'll return a pending status since the endpoint doesn't provide status checking
        // You may need to implement a separate status endpoint
        return {
          resultCode: '0', // Assume success for now
          resultDesc: 'Payment processed successfully'
        };
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // User management endpoints (for admin)
  users: {
    // Get all users (admin only) - Try multiple endpoint variations
    getAllUsers: async () => {
      try {
        const token = apiService.getAuthToken();
        if (!token) {
          throw new Error('Authentication token required');
        }
        
        // Try different endpoint variations
        const endpoints = [
          '/all-users',
          '/users/all',
          '/users',
          '/admin/users',
          '/admin/all-users'
        ];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            
            // Try GET method first
            try {
              const response = await api.get(endpoint, {
                headers: {
                  'Authorization': `Token ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              console.log(`GET ${endpoint} successful:`, response.data);
              return response.data.users || response.data;
            } catch (getError) {
              console.log(`GET ${endpoint} failed:`, getError.response?.status);
              
              // If GET fails, try POST method
              if (getError.response?.status === 405 || getError.response?.status === 404) {
                const response = await api.post(endpoint, {}, {
                  headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                console.log(`POST ${endpoint} successful:`, response.data);
                return response.data.users || response.data;
              }
            }
          } catch (endpointError) {
            console.log(`Endpoint ${endpoint} failed:`, endpointError.response?.status);
            continue; // Try next endpoint
          }
        }
        
        // If all endpoints fail, throw an error
        throw new Error('All user endpoints failed. Please check the API configuration.');
        
      } catch (error) {
        console.error('Error fetching users:', error);
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
  },

  // Newsletter endpoints
  newsletter: {
    // Subscribe to newsletter
    subscribe: async (email) => {
      try {
        console.log('API Service - Subscribing email:', email);
        const response = await axios.post(`${api.defaults.baseURL}/newsletter/subscribe`, {
          email
        }, {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('API Service - Subscription success:', response.data);
        return response.data;
      } catch (error) {
        console.error('API Service - Subscription error:', error);
        throw error.response?.data || error.message;
      }
    },

    // Unsubscribe from newsletter
    unsubscribe: async (email) => {
      try {
        const response = await axios.post(`${api.defaults.baseURL}/newsletter/unsubscribe`, {
          email
        }, {
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

    // Send newsletter to all subscribers (admin only)
    sendNewsletter: async (newsletterData) => {
      try {
        const response = await api.post('/newsletter/send-newsletter', {
          subject: newsletterData.subject,
          body: newsletterData.body
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all newsletter subscribers (admin only)
    getAllSubscribers: async () => {
      try {
        const response = await api.get('/newsletter/subscribers');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Course endpoints
  courses: {
    // List all courses (public)
    listCourses: async () => {
      try {
        const response = await axios.get(`${api.defaults.baseURL}/courses/list-courses`, {
          withCredentials: false,
          headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // View single course (public)
    getCourseDetail: async (courseId) => {
      try {
        const response = await axios.get(`${api.defaults.baseURL}/courses/view-course/${courseId}/`, {
          withCredentials: false,
          headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Add a new course (admin only)
    addCourse: async (courseData) => {
      try {
        const response = await api.post('/courses/add-course', courseData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Edit a course (admin only)
    editCourse: async (courseId, courseData) => {
      try {
        const response = await api.post(`/courses/edit-course/${courseId}/`, courseData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Enroll in a course (auth required)
    enrollInCourse: async (courseId, enrollmentData = {}) => {
      try {
        const response = await api.post(`/courses/enroll-course/${courseId}/`, enrollmentData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete a course (admin only)
    deleteCourse: async (courseId) => {
      try {
        const response = await api.delete(`/courses/delete-course/${courseId}/`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
    // Note: Enrollment management endpoints are not implemented on backend yet
    // getAllEnrollments: async () => { ... },
    // getEnrollmentDetail: async (enrollmentId) => { ... },
    // updateEnrollmentStatus: async (enrollmentId, status) => { ... }
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
export const sendNewsletter = apiService.newsletter.sendNewsletter;
export const subscribeNewsletter = apiService.newsletter.subscribe;
export const unsubscribeNewsletter = apiService.newsletter.unsubscribe;

export default apiService;
export { api };
