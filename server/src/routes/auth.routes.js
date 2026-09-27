const express = require("express");

const {
    register,
    login, 
    verifyEmail,
    logout, 
    getMe, 
    forgotPassword, 
    verifyResetOTP,
} = require("../controllers/auth.controller");

const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.get("/me", requireAuth, getMe);

module.exports = router;