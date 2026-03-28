import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  adminLogin: (data) => api.post('/auth/admin-login', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Product APIs
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  seedProducts: () => api.post('/products/seed')
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId, staticData) => api.post('/wishlist', { productId, staticData }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  clearWishlist: () => api.delete('/wishlist')
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/myorders'),
  getOrders: () => api.get('/orders'),
  updateOrderToDelivered: (id) => api.put(`/orders/${id}/deliver`),
  deleteOrder: (id) => api.delete(`/orders/${id}`)
};

// Drama Foods APIs
export const dramaAPI = {
  getDramaFoods: () => api.get('/drama-foods'),
  getDramaFoodById: (id) => api.get(`/drama-foods/${id}`),
  seedDramaFoods: () => api.post('/drama-foods/seed')
};

// Admin APIs
export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  users: () => api.get('/admin/users'),
  orders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  wishlist: () => api.get('/admin/wishlist'),
  contacts: () => api.get('/admin/contacts'),
  analytics: () => api.get('/admin/analytics')
};

// Contact APIs
export const contactAPI = {
  submitMessage: (data) => api.post('/contact', data),
  getAllMessages: () => api.get('/contact'),
  deleteMessage: (id) => api.delete(`/contact/${id}`)
};

export default api;

