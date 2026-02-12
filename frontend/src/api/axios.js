import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-health-fitness-backend.onrender.com/api",
    timeout: 60000, // 60 seconds to allow backend wake-up

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
