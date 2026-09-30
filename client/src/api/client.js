import axios from "axios";

const api = axios.create({
  // In development, Vite proxies /api to the backend. This keeps API calls
  // on the page's own origin, which works from localhost and forwarded URLs.
  // Set VITE_API_URL only when the deployed API has a separate origin.
  baseURL: import.meta.env.VITE_API_URL || "/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(
        new Event("hermes:unauthorized")
      );
    }

    return Promise.reject(error);
  }
);

export default api;
