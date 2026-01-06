import axios from "axios";

const Instance = axios.create({
  baseURL: "https://fakestoreapi.com",
});

// ✅ Add Authorization header for every request
Instance.interceptors.request.use(
  (config) => {
    
   const token = JSON.parse(localStorage.getItem("userData"))?.token;
// get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Instance;
