"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleNotificationController = exports.deleteAllNotificationController = exports.seenSingleNotificationController = exports.seenAllNotificationController = exports.getNumberOfUnseenNotificationController = exports.getUserAllNotificationsController = exports.createNotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
// CREATE NOTIFICATION
const createNotificationController = async (req, res) => {
    try {
        const result = await (0, notification_service_1.createNotification)(req.body);
        if (result.success) {
            res.status(201).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createNotificationController = createNotificationController;
// GET ALL USER NOTIFICATIONS
const getUserAllNotificationsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await (0, notification_service_1.getUserAllNotifications)(userId);
        if (result.success) {
            res.status(200).json({ data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserAllNotificationsController = getUserAllNotificationsController;
// GET NUMBER OF UNSEEN NOTIFICATIONS
const getNumberOfUnseenNotificationController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await (0, notification_service_1.getNumberOfUnseenNotification)(userId);
        if (result.success) {
            res.status(200).json({ data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getNumberOfUnseenNotificationController = getNumberOfUnseenNotificationController;
// SEEN ALL NOTIFICATIONS
const seenAllNotificationController = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const result = await (0, notification_service_1.seenAllNotification)(receiverId);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.seenAllNotificationController = seenAllNotificationController;
// SEEN SINGLE NOTIFICATION
const seenSingleNotificationController = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const result = await (0, notification_service_1.seenSingleNotification)(notificationId);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.seenSingleNotificationController = seenSingleNotificationController;
// DELETE ALL NOTIFICATIONS
const deleteAllNotificationController = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const result = await (0, notification_service_1.deleteAllNotification)(receiverId);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteAllNotificationController = deleteAllNotificationController;
// DELETE SINGLE NOTIFICATION
const deleteSingleNotificationController = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const result = await (0, notification_service_1.deleteSingleNotification)(notificationId);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteSingleNotificationController = deleteSingleNotificationController;
