import api from "./api"; // axios instance

export const idolAPI = {
  // ✅ get all idols
  getAll: () => api.get("/idols"),

  // ✅ 🔥 ADD THIS (missing tha isliye error aa raha hai)
  getAllFavoriteFoods: () => api.get("/idols/foods"),

  // ✅ get foods by idol
  getFavoriteFoods: (idolId) =>
    api.get(`/idols/${idolId}/foods`),

  // admin
  create: (data) => api.post("/idols", data),
  update: (id, data) => api.put(`/idols/${id}`, data),
  delete: (id) => api.delete(`/idols/${id}`),

  // ✅ add food
  addFood: (idolId, data) =>
    api.post(`/idols/${idolId}/foods`, data),
};