import express from "express";
import {
  viewNotifications,
  markNotificationAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { mongoIdParamSchema } from "../middleware/schemas.js";

const router = express.Router();

router.use(protect);
router.use(authorize("citizen", "employee", "admin"));

router.get("/", viewNotifications);
router.put("/read-all", markAllAsRead);
router.put(
  "/:id/read",
  validate(mongoIdParamSchema, "params"),
  markNotificationAsRead
);

export default router;
