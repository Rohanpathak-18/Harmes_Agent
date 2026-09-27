const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Organization = require("../models/Organization");
const Membership = require("../models/Membership");
const OTP = require("../models/OTP");

const Session = require("../models/Session");

const {
    generateSessionToken,
    hashToken,
} = require("../utils/token");

const {
    generateOTP,
    hashOTP,
} = require("../utils/otp");

const register = async (req, res) => {
    try {
      const {
    name,
    email,
    password,
    organizationName,
} = req.body || {};

        // 1. Validate required fields
        if (!name || !email || !password || !organizationName) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and organization name are required",
            });
        }

        // 2. Basic password validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 3. Check whether user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        // 4. Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // 5. Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: passwordHash,
        });

        // 6. Create organization slug
        const slug =
            organizationName
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "") +
            "-" +
            Date.now();

        // 7. Create organization
        const organization = await Organization.create({
            name: organizationName.trim(),
            slug,
            owner: user._id,
        });

        // 8. Create owner membership
        await Membership.create({
            user: user._id,
            organization: organization._id,
            role: "owner",
            status: "active",
        });

        // 9. Generate email verification OTP
        const otp = generateOTP();
        const codeHash = hashOTP(otp);

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await OTP.create({
            user: user._id,
            codeHash,
            purpose: "email_verification",
            expiresAt,
        });

        return res.status(201).json({
            success: true,
            message: "Account created. Please verify your email.",
            data: {
                userId: user._id,
                organizationId: organization._id,
                email: user.email,

                // Development only
                otp,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during registration",
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user and explicitly include password
        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active",
            });
        }

        // Check password
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Email verification check
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
                requiresEmailVerification: true,
            });
        }

        // Generate session token
        const sessionToken = generateSessionToken();
        const tokenHash = hashToken(sessionToken);

        // Session expires in 7 days
        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await Session.create({
            user: user._id,
            tokenHash,
            expiresAt,
            ipAddress: req.ip,
            userAgent: req.get("user-agent") || null,
        });

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // HTTP-only cookie
        res.cookie("hermes_session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified,
                },
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during login",
        });
    }
};


const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body || {};

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        const otpRecord = await OTP.findOne({
            user: user._id,
            purpose: "email_verification",
            consumed: false,
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP is invalid or expired",
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        if (otpRecord.attempts >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many OTP attempts. Please request a new OTP.",
            });
        }

        const hashedInput = hashOTP(otp);

        if (hashedInput !== otpRecord.codeHash) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Mark OTP as used
        otpRecord.consumed = true;
        await otpRecord.save();

        // Verify user email
        user.isEmailVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("Verify email error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying email",
        });
    }
};

const logout = async (req, res) => {
    try {
        const sessionToken = req.cookies.hermes_session;

        if (sessionToken) {
            const tokenHash = hashToken(sessionToken);

            await Session.findOneAndUpdate(
                {
                    tokenHash,
                    revokedAt: null,
                },
                {
                    revokedAt: new Date(),
                }
            );
        }

        res.clearCookie("hermes_session", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};


const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            isEmailVerified: req.user.isEmailVerified,
            status: req.user.status,
        },
    });
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body || {};

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        // Don't reveal whether an account exists
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If an account exists, a password reset OTP has been sent",
            });
        }

        const otp = generateOTP();
        const codeHash = hashOTP(otp);

        const expiresAt = new Date(
            Date.now() + 60 * 1000
        );

        await OTP.updateMany(
            {
                user: user._id,
                purpose: "password_reset",
                consumed: false,
            },
            {
                consumed: true,
            }
        );

        await OTP.create({
            user: user._id,
            codeHash,
            purpose: "password_reset",
            expiresAt,
        });

        // Development only
        console.log("Password reset OTP:", otp);

        return res.status(200).json({
            success: true,
            message: "If an account exists, a password reset OTP has been sent",
            // Remove this when email service is connected
            otp,
        });
    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to process password reset",
        });
    }
};


const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body || {};

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        const otpRecord = await OTP.findOne({
            user: user._id,
            purpose: "password_reset",
            consumed: false,
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        if (otpRecord.attempts >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many OTP attempts",
            });
        }

        const hashedInput = hashOTP(String(otp));

        if (hashedInput !== otpRecord.codeHash) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        otpRecord.consumed = true;
        await otpRecord.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });
    } catch (error) {
        console.error("Verify reset OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify OTP",
        });
    }
}; 


module.exports = {
    register,
    login,
    verifyEmail,
    logout,
    getMe,
    forgotPassword,
    verifyResetOTP,
};