import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { tokenBlacklist } from "../middleware/authMiddleware.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * Shared login logic for role-scoped endpoints.
 */
const loginWithRole = async (req, res, allowedRoles, label) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Contact administration.",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This endpoint is for ${label} accounts only.`,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: `${label} login successful`,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      },
    });
  } catch (error) {
    console.error(`${label} login error:`, error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new citizen account
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "citizen",
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Citizen login
 * @access  Public
 */
export const login = async (req, res) => {
  return loginWithRole(req, res, ["citizen"], "Citizen");
};

/**
 * @route   POST /api/auth/employee/login
 * @desc    Employee login (separate from citizen)
 * @access  Public
 */
export const employeeLogin = async (req, res) => {
  return loginWithRole(req, res, ["employee"], "Employee");
};

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login (separate from citizen/employee)
 * @access  Public
 * @note    Superadmin monitoring is handled by Backend Member 2
 */
export const adminLogin = async (req, res) => {
  return loginWithRole(req, res, ["admin"], "Admin");
};

/**
 * @route   POST /api/auth/logout
 * @desc    Invalidate current JWT (blacklist)
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    if (req.token) {
      tokenBlacklist.add(req.token);
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate reset token and send email (or mock log)
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return success to avoid email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (mailError) {
      console.error("Email send failed:", mailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
      // Exposed only in non-production for easier testing
      ...(process.env.NODE_ENV !== "production" && { resetToken }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during password reset request",
    });
  }
};

/**
 * @route   PUT /api/auth/reset-password/:token
 * @desc    Reset password using token from email
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};
