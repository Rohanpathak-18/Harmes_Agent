import { create } from "zustand";

import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
} from "../api/auth";
import { saveSessionToken } from "../api/client";

const useAuthStore = create((set) => ({
  user: null,

  loading: true,

  initialized: false,

  initialize: async () => {
    try {
      const response = await getMe();

      const user = Object.prototype.hasOwnProperty.call(response || {}, "user")
        ? response.user
        : response?.data?.user || response?.data || response;

      set({
        user,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      set({
        user: null,
        loading: false,
        initialized: true,
      });
    }
  },

  login: async (credentials) => {
    const response =
      await loginRequest(credentials);

    saveSessionToken(response?.data?.sessionToken || response?.sessionToken);

    const user = response?.user || response?.data?.user;
    if (user) set({ user });

    return response;
  },

  logout: async () => {
    try {
      await logoutRequest();
    } finally {
      window.localStorage.removeItem("hermes_session_token");
      set({
        user: null,
      });
    }
  },

  setUser: (user) => {
    set({
      user,
    });
  },

  clearUser: () => {
    set({
      user: null,
    });
  },
}));

export default useAuthStore;
