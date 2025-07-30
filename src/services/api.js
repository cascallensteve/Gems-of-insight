import axios from 'axios';

const BASE_URL = 'https://gems-of-truth.vercel.app';

// Auth token management
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const getUserData = () => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

const setUserData = (userData) => {
  localStorage.setItem('currentUser', JSON.stringify(userData));
};

const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  delete axios.defaults.headers.common['Authorization'];
};

// API calls
export const signUp = async (data) => {
  const response = await axios.post(`${BASE_URL}/signUp`, data);
  return response.data;
};

export const login = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data);
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await axios.post(`${BASE_URL}/verify-email`, data);
  return response.data;
};

export const resendVerificationOtp = async (data) => {
  const response = await axios.post(`${BASE_URL}/resend-verification-otp`, data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await axios.post(`${BASE_URL}/forgot-password`, data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axios.post(`${BASE_URL}/reset-password`, data);
  return response.data;
};

// Orders API
export const createOrder = async (orderData) => {
  const response = await axios.post(`${BASE_URL}/orders`, orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await axios.get(`${BASE_URL}/orders/user`);
  return response.data;
};

// User Profile API
export const getUserProfile = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await axios.get(`${BASE_URL}/user/profile`, {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await axios.put(`${BASE_URL}/user/profile`, profileData, {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  return response.data;
};

// M-Pesa Payment API
export const initiateMpesaPayment = async (paymentData) => {
  const response = await axios.post(`${BASE_URL}/payments/mpesa`, paymentData);
  return response.data;
};

export const checkPaymentStatus = async (transactionId) => {
  const response = await axios.get(`${BASE_URL}/payments/status/${transactionId}`);
  return response.data;
};

// Default export for compatibility
const apiService = {
  getAuthToken,
  setAuthToken,
  getUserData,
  setUserData,
  clearAuth,
  signUp,
  login,
  verifyEmail,
  resendVerificationOtp,
  forgotPassword,
  resetPassword,
  createOrder,
  getUserOrders,
  getUserProfile,
  updateUserProfile,
  initiateMpesaPayment,
  checkPaymentStatus
};

export default apiService;
