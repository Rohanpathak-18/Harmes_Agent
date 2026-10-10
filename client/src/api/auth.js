import api from "./client";

// Registration and unverified login send an email before responding. SMTP
// connection and socket timeouts are longer than the generic API timeout.
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

export const verifyEmail = async (data) => {
    const response = await api.post(
        "/auth/verify-email",
        data,
        { timeout: AUTH_REQUEST_TIMEOUT_MS }
    );

    return response.data;
};

export const resendVerification = async (
    email
) => {
    const response = await api.post(
        "/auth/resend-verification",
        {
            email,
        },
        { timeout: AUTH_REQUEST_TIMEOUT_MS }
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

