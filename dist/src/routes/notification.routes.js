"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
router.use(auth_middleware_1.requireAuth);
// CREATE NOTIFICATION
router.post("/", notification_controller_1.createNotificationController);
// GET USER NOTIFICATIONS
router.get("/user/:userId", notification_controller_1.getUserAllNotificationsController);
// GET NUMBER OF UNSEEN NOTIFICATIONS
router.get("/unseen/:userId", notification_controller_1.getNumberOfUnseenNotificationController);
// SEEN ALL NOTIFICATIONS
router.patch("/seen/all/:receiverId", notification_controller_1.seenAllNotificationController);
// SEEN SINGLE NOTIFICATION
router.patch("/seen/:notificationId", notification_controller_1.seenSingleNotificationController);
// DELETE ALL NOTIFICATIONS
router.delete("/:receiverId", notification_controller_1.deleteAllNotificationController);
// DELETE SINGLE NOTIFICATION
router.delete("/single/:notificationId", notification_controller_1.deleteSingleNotificationController);
exports.default = router;
