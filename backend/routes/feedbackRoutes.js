import express from "express";
import {
  submitFeedback,
  getMyFeedback,
  getFeedbackById,
  deleteFeedback,
} from "../controllers/feedbackController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { feedbackSchema, mongoIdParamSchema } from "../middleware/schemas.js";

const router = express.Router();

router.use(protect);
router.use(authorize("citizen"));

router.post("/", validate(feedbackSchema), submitFeedback);
router.get("/", getMyFeedback);
router.get("/:id", validate(mongoIdParamSchema, "params"), getFeedbackById);
router.delete("/:id", validate(mongoIdParamSchema, "params"), deleteFeedback);

export default router;
