import express from "express";
import {
  submitApplication,
  saveApplication,
  editApplication,
  deleteApplication,
  trackByApplicationId,
  trackByCitizenId,
  getApplicationById,
} from "../controllers/serviceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  applicationSchema,
  editApplicationSchema,
  mongoIdParamSchema,
} from "../middleware/schemas.js";
import {
  uploadMultiple,
  handleUploadError,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("citizen"));

// Submit & save
router.post(
  "/applications",
  uploadMultiple("attachments", 5),
  handleUploadError,
  validate(applicationSchema),
  submitApplication
);

router.post(
  "/applications/draft",
  uploadMultiple("attachments", 5),
  handleUploadError,
  validate(applicationSchema),
  saveApplication
);

// Citizen application history (optional ?status=&applicationType=)
router.get("/my-applications", trackByCitizenId);

// Track by custom tracking ID (WARD-YYYY-XXXXX)
router.get("/track/:trackingId", trackByApplicationId);

// Single application by Mongo _id
router.get(
  "/applications/:id",
  validate(mongoIdParamSchema, "params"),
  getApplicationById
);

router.put(
  "/applications/:id",
  validate(mongoIdParamSchema, "params"),
  uploadMultiple("attachments", 5),
  handleUploadError,
  validate(editApplicationSchema),
  editApplication
);

router.delete(
  "/applications/:id",
  validate(mongoIdParamSchema, "params"),
  deleteApplication
);

export default router;
