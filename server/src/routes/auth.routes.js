const express = require("express");

const {
    register,
    login, 
    verifyEmail,
    logout, 
    getMe, 
    forgotPassword, 
    verifyResetOTP,
    resetPassword,
} = require("../controllers/auth.controller");

const { requireAuth } = require("../middleware/auth.middleware");

const {
    authRateLimiter,
    otpRateLimiter,
} = require("../middleware/rateLimit.middleware");

const router = express.Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/verify-email", otpRateLimiter, verifyEmail);
router.post("/logout", logout);
router.post("/forgot-password", otpRateLimiter, forgotPassword);
router.post("/verify-reset-otp", otpRateLimiter, verifyResetOTP);
router.post("/reset-password", authRateLimiter, resetPassword);
router.get("/me", requireAuth, getMe);

module.exports = router;