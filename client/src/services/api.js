import axios from "axios";

const API = axios.create({ baseURL: "/api", timeout: 30000 });

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error || err.message || "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

// Auth
export const registerAPI  = (data) => API.post("/auth/register", data);
export const loginAPI     = (data) => API.post("/auth/login", data);
export const getMeAPI     = ()     => API.get("/auth/me");

// Platforms
export const connectPlatformAPI  = (data)             => API.post("/platforms/connect", data);
export const getDashboardAPI     = ()                  => API.get("/platforms/dashboard");
export const refreshAllAPI       = ()                  => API.post("/platforms/refresh-all");
export const getPublicProfileAPI = (platform, handle) => API.get(`/platforms/${platform}/${handle}`);

// Leaderboard
export const getLeaderboardAPI = (page = 1) => API.get(`/leaderboard?page=${page}`);
export const compareUsersAPI   = (u1, u2)   => API.get(`/leaderboard/compare/${u1}/${u2}`);

export default API;
