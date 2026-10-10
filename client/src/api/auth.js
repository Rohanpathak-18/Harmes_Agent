import api from "./client";

// Password reset emails can take longer than a typical API request.
const AUTH_REQUEST_TIMEOUT_MS = 45000;

export const register = async (data) => {
    const response = await api.post(
        "/auth/register",
        data,
        { timeout: AUTH_REQUEST_TIMEOUT_MS }
    );

    return response.data;
};

export const login = async (data) => {
    const response = await api.post(
        "/auth/login",
        data,
        { timeout: AUTH_REQUEST_TIMEOUT_MS }
    );

    return response.data;
};

export const getMe = async () => {
    const response = await api.get(
        "/auth/me"
    );

    return response.data;
};

export const logout = async () => {
    const response = await api.post(
        "/auth/logout"
    );

    return response.data;
};

export const forgotPassword = async (
    data
) => {
    const response = await api.post(
        "/auth/forgot-password",
        data,
        { timeout: AUTH_REQUEST_TIMEOUT_MS }
    );

    return response.data;
};

export const verifyResetOTP = async (
    data
) => {
    const response = await api.post(
        "/auth/verify-reset-otp",
        data,
        { timeout: AUTH_REQUEST_TIMEOUT_MS }
    );

    return response.data;
};

export const resetPassword = async (
    data
) => {
    const response = await api.post(
        "/auth/reset-password",
        data,
        { timeout: AUTH_REQUEST_TIMEOUT_MS }
    );

    return response.data;
};

