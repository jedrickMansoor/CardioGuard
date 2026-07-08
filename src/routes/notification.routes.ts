import express from "express";
const router = express.Router();

import {
  createNotificationController,
  getUserAllNotificationsController,
  getNumberOfUnseenNotificationController,
  seenAllNotificationController,
  seenSingleNotificationController,
  deleteAllNotificationController,
  deleteSingleNotificationController,
} from "../controllers/notification.controller";
import { requireAuth } from "../middlewares/auth.middleware";

router.use(requireAuth);

// CREATE NOTIFICATION
router.post("/", createNotificationController);

// GET USER NOTIFICATIONS
router.get("/user/:userId", getUserAllNotificationsController);

// GET NUMBER OF UNSEEN NOTIFICATIONS
router.get("/unseen/:userId", getNumberOfUnseenNotificationController);

// SEEN ALL NOTIFICATIONS
router.patch("/seen/all/:receiverId", seenAllNotificationController);

// SEEN SINGLE NOTIFICATION
router.patch("/seen/:notificationId", seenSingleNotificationController);

// DELETE ALL NOTIFICATIONS
router.delete("/:receiverId", deleteAllNotificationController);

// DELETE SINGLE NOTIFICATION
router.delete("/single/:notificationId", deleteSingleNotificationController);

export default router;
