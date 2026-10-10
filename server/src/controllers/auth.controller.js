const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Organization = require("../models/Organization");
const Membership = require("../models/Membership");
const OTP = require("../models/OTP");

const Session = require("../models/Session");

const { createAuditLog } = require("../services/audit.service");

const { sendVerificationEmail } = require("../services/email.service");

const { generateSessionToken, hashToken } = require("../utils/token");

const { generateOTP, hashOTP } = require("../utils/otp");

const isValidOTP = (otp) => /^\d{6}$/.test(String(otp ?? "").trim());

const register = async (req, res) => {
  try {
    const { name, email, password, organizationName } = req.body || {};

    // 1. Validate required fields
    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string" ||
      typeof organizationName !== "string" || !organizationName.trim()
    ) {
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address" });
    }

    // 3. Check whether user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (existingUser) {
      if (
        !(await bcrypt.compare(password, existingUser.password))
      ) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists. Sign in or use password recovery.",
        });
      }

      let membership = await Membership.findOne({
        user: existingUser._id,
        status: "active",
      });
      if (membership) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists. Sign in instead.",
        });
      }

      const slug = `${organizationName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")}-${Date.now()}`;
      const organization = await Organization.create({
        name: organizationName.trim(),
        slug,
        owner: existingUser._id,
      });
      await Membership.create({
        user: existingUser._id,
        organization: organization._id,
        role: "owner",
        status: "active",
      });

      return res.status(200).json({
        success: true,
        message: "Your account is ready. You can now sign in.",
        data: { email: existingUser.email },
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

    return res.status(201).json({
      success: true,
      message: "Account created. You can now sign in.",
      data: {
        userId: user._id,
        organizationId: organization._id,
        email: user.email,
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
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return createSession(req, res, user);
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

const createSession = async (req, res, user) => {
  const sessionToken = generateSessionToken();
  const tokenHash = hashToken(sessionToken);

  // Session expires in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      sessionToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

const logout = async (req, res) => {
  try {
    const sessionToken = req.cookies.hermes_session ||
      (req.get("authorization") || "").match(/^Bearer\s+(.+)$/i)?.[1];

    if (sessionToken) {
      const tokenHash = hashToken(sessionToken);

      await Session.findOneAndUpdate(
        {
          tokenHash,
          revokedAt: null,
        },
        {
          revokedAt: new Date(),
        },
      );
    }

    res.clearCookie("hermes_session", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
  if (!req.user) {
    return res.status(200).json({ success: true, user: null });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
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

    await createAndSendOTP(user, "password_reset");

    return res.status(200).json({
      success: true,
      message: "If an account exists, a password reset OTP has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(503).json({
      success: false,
      message:
        "Unable to send a password reset code right now. Please try again shortly.",
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

    if (!isValidOTP(otp)) {
      return res.status(400).json({ success: false, message: "OTP must be 6 digits" });
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

    const hashedInput = hashOTP(String(otp).trim());

    if (hashedInput !== otpRecord.codeHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

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

const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body || {};

    if (!email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email, verification code and new password are required",
      });
    }

    if (!isValidOTP(otp)) {
      return res.status(400).json({ success: false, message: "Verification code must be 6 digits" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Unable to reset password",
      });
    }

    const otpRecord = await OTP.findOne({
      user: user._id,
      purpose: "password_reset",
      consumed: false,
    }).sort({ createdAt: -1 });
    if (!otpRecord || otpRecord.expiresAt <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "The reset code is invalid or expired. Request a new code.",
      });
    }
    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Request a new reset code.",
      });
    }
    if (hashOTP(String(otp).trim()) !== otpRecord.codeHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res
        .status(400)
        .json({ success: false, message: "The reset code is incorrect." });
    }
    otpRecord.consumed = true;
    await otpRecord.save();

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    await user.save();

    // Revoke all existing sessions after password reset
    await Session.updateMany(
      {
        user: user._id,
        revokedAt: null,
      },
      {
        revokedAt: new Date(),
      },
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login again.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};

const createAndSendOTP = async (user, purpose) => {
  const otp = generateOTP();

  await OTP.deleteMany({
    user: user._id,
    purpose,
    consumed: false,
  });

  const otpDocument = await OTP.create({
    user: user._id,
    codeHash: hashOTP(otp),
    purpose,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),

    attempts: 0,
    consumed: false,
  });

  try {
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      otp,
      purpose,
    });
  } catch (error) {
    await OTP.findByIdAndDelete(otpDocument._id);

    throw error;
  }

  return otpDocument;
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
