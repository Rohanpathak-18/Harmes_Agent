const express = require("express");

const {
    register,
    login,
    verifyEmail,
    resendVerificationOTP,
    logout,
    getMe,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
} = require("../controllers/auth.controller");

const {
    requireAuth,
    optionalAuth,
} = require("../middleware/auth.middleware");
const { authRateLimiter, otpRateLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

router.post(
    "/register",
    authRateLimiter,
    register
);

router.post(
    "/login",
    authRateLimiter,
    login
);

router.post(
    "/verify-email",
    otpRateLimiter,
    verifyEmail
);

router.post(
    "/resend-verification",
    otpRateLimiter,
    resendVerificationOTP
);

router.post(
    "/forgot-password",
    otpRateLimiter,
    forgotPassword
);

router.post(
    "/verify-reset-otp",
    otpRateLimiter,
    verifyResetOTP
);

router.post(
    "/reset-password",
    otpRateLimiter,
    resetPassword
);

router.post(
    "/logout",
    requireAuth,
    logout
);

router.get(
    "/me",
    optionalAuth,
    getMe
);

module.exports = router;
