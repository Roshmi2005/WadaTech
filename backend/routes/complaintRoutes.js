import express from "express";
import {
  submitComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  complaintSchema,
  editComplaintSchema,
  mongoIdParamSchema,
} from "../middleware/schemas.js";
import {
  uploadMultiple,
  handleUploadError,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("citizen"));

router.post(
  "/",
  uploadMultiple("attachments", 5),
  handleUploadError,
  validate(complaintSchema),
  submitComplaint
);

router.get("/", getMyComplaints);

router.get(
  "/:id",
  validate(mongoIdParamSchema, "params"),
  getComplaintById
);

router.put(
  "/:id",
  validate(mongoIdParamSchema, "params"),
  uploadMultiple("attachments", 5),
  handleUploadError,
  validate(editComplaintSchema),
  updateComplaint
);

router.delete(
  "/:id",
  validate(mongoIdParamSchema, "params"),
  deleteComplaint
);

export default router;
