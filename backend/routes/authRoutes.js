import express from "express";
import {
  register,
  login,
  employeeLogin,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../middleware/schemas.js";

const router = express.Router();

// Public — citizen registration & login
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Public — separate employee & admin logins
router.post("/employee/login", validate(loginSchema), employeeLogin);
router.post("/admin/login", validate(loginSchema), adminLogin);

// Public — password recovery
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.put(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword
);

// Private — logout (blacklist token)
router.post("/logout", protect, logout);

export default router;
