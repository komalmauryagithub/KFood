import axios from "axios";

// ✅ ENV URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ AXIOS INSTANCE
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error?.response?.data || error.message);

    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

// ================= AUTH =================
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  adminLogin: (data) => api.post("/auth/admin-login", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// ================= PRODUCTS =================
export const productAPI = {
  getProducts: (params) => api.get("/products", { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  seedProducts: () => api.post("/products/seed"),
};

// ================= WISHLIST =================
export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (productId, staticData = {}) =>
    api.post("/wishlist", { productId, staticData }),
  removeFromWishlist: (productId) =>
    api.delete(`/wishlist/${productId}`),
  clearWishlist: () => api.delete("/wishlist"),
};

// ================= ORDERS =================
export const orderAPI = {
  createOrder: (data) => api.post("/orders", data),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get("/orders/myorders"),
  getOrders: () => api.get("/orders"),
  updateOrderToDelivered: (id) =>
    api.put(`/orders/${id}/deliver`),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

// ================= DRAMA =================
export const dramaAPI = {
  getDramaFoods: () => api.get("/drama-foods"),
  getDramaFoodById: (id) => api.get(`/drama-foods/${id}`),
  seedDramaFoods: () => api.post("/drama-foods/seed"),
};

// ================= ADMIN =================
export const adminAPI = {
  dashboard: () => api.get("/admin/dashboard"),
  users: () => api.get("/admin/users"),
  orders: () => api.get("/admin/orders"),
  updateOrderStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }),
  wishlist: () => api.get("/admin/wishlist"),
  contacts: () => api.get("/admin/contacts"),
  analytics: () => api.get("/admin/analytics"),
};

// ================= CONTACT =================
export const contactAPI = {
  submitMessage: (data) => api.post("/contact", data),
  getAllMessages: () => api.get("/contact"),
  deleteMessage: (id) => api.delete(`/contact/${id}`),
};

// ================= IDOL (🔥 FIXED) =================
export const idolAPI = {
  getAll: () => api.get("/idols"),
  create: (data) => api.post("/idols", data),
  update: (id, data) => api.put(`/idols/${id}`, data),
  delete: (id) => api.delete(`/idols/${id}`),

  // ✅ ADD FOOD (IMPORTANT FIX)
  addFood: (idolId, data) =>
    api.post(`/idols/${idolId}/foods`, data),
};

export default api;