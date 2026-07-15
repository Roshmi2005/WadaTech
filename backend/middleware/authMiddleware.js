import jwt from "jsonwebtoken";
import User from "../models/User.js";

/** In-memory JWT blacklist for logout (cleared on server restart). */
export const tokenBlacklist = new Set();

/**
 * Verify Bearer JWT and attach user payload to req.user
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        success: false,
        message: "Token has been invalidated. Please log in again.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

/**
 * Restrict route access to specific roles.
 * Usage: authorize("citizen") or authorize("employee", "admin")
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

export default protect;
