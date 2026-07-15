import express from "express";
import {
  viewProfile,
  editProfile,
  changePassword,
  uploadProfilePicture,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  editProfileSchema,
  changePasswordSchema,
} from "../middleware/schemas.js";
import {
  uploadSingle,
  handleUploadError,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("citizen", "employee", "admin"));

router.get("/profile", viewProfile);
router.put("/profile", validate(editProfileSchema), editProfile);
router.put(
  "/change-password",
  validate(changePasswordSchema),
  changePassword
);
router.put(
  "/profile-picture",
  uploadSingle("profilePicture"),
  handleUploadError,
  uploadProfilePicture
);

export default router;
