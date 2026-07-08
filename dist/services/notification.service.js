"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleNotification = exports.deleteAllNotification = exports.seenSingleNotification = exports.seenAllNotification = exports.getNumberOfUnseenNotification = exports.getUserAllNotifications = exports.createNotification = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
// CREATE NOTIFICATION
const createNotification = async (data) => {
    try {
        const { senderId, receiverId, message, type, source } = data;
        // Validate sender and receiver
        const sender = await user_model_1.default.findById(senderId);
        if (!sender)
            return { success: false, message: "Sender not found" };
        const receiver = await user_model_1.default.findById(receiverId);
        if (!receiver)
            return { success: false, message: "Receiver not found" };
        // Create the notification
        const newNotification = await notification_model_1.default.create({
            senderId: new mongoose_1.default.Types.ObjectId(senderId),
            receiverId: new mongoose_1.default.Types.ObjectId(receiverId),
            message,
            type,
            ...((source?.id || source?.type) && {
                source: {
                    ...(source?.id && { id: new mongoose_1.default.Types.ObjectId(source.id) }),
                    ...(source?.type && { type: source.type }),
                },
            }),
        });
        return {
            success: true,
            message: "Notification created successfully",
            data: newNotification,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.createNotification = createNotification;
// GET USER NOTIFICATIONS
const getUserAllNotifications = async (userId) => {
    try {
        const notifications = await notification_model_1.default.find({
            receiverId: new mongoose_1.default.Types.ObjectId(userId),
        })
            .populate("senderId", "name email userId picture")
            .populate({
            path: "source.id",
            populate: [
                {
                    path: "doctorId",
                    select: "name email picture doctorInfo",
                    populate: {
                        path: "doctorInfo",
                        model: "DoctorInfo",
                    },
                },
                {
                    path: "patientId",
                    select: "name email picture",
                },
            ],
        })
            .sort({ createdAt: -1 })
            .lean();
        return {
            success: true,
            message: "Notifications retrieved successfully",
            data: notifications,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getUserAllNotifications = getUserAllNotifications;
// GET NUMBER OF UNSEEN NOTIFICATIONS
const getNumberOfUnseenNotification = async (userId) => {
    try {
        const count = await notification_model_1.default.countDocuments({
            receiverId: new mongoose_1.default.Types.ObjectId(userId),
            seen: false,
        });
        return {
            success: true,
            message: "Unseen notifications count retrieved successfully",
            data: count,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getNumberOfUnseenNotification = getNumberOfUnseenNotification;
// SEEN ALL NOTIFICATIONS
const seenAllNotification = async (receiverId) => {
    try {
        const result = await notification_model_1.default.updateMany({ receiverId: new mongoose_1.default.Types.ObjectId(receiverId), seen: false }, { seen: true });
        return {
            success: true,
            message: "All notifications marked as seen",
            data: result,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.seenAllNotification = seenAllNotification;
// SEEN SINGLE NOTIFICATION
const seenSingleNotification = async (notificationId) => {
    try {
        const notification = await notification_model_1.default.findByIdAndUpdate(notificationId, { seen: true }, { new: true })
            .populate("senderId", "name email userId picture")
            .populate({
            path: "source.id",
            populate: [
                {
                    path: "doctorId",
                    select: "name email picture doctorInfo",
                    populate: {
                        path: "doctorInfo",
                        model: "DoctorInfo",
                    },
                },
                {
                    path: "patientId",
                    select: "name email picture",
                },
            ],
        });
        if (!notification) {
            return { success: false, message: "Notification not found" };
        }
        return {
            success: true,
            message: "Notification marked as seen",
            data: notification,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.seenSingleNotification = seenSingleNotification;
// DELETE ALL NOTIFICATIONS
const deleteAllNotification = async (receiverId) => {
    try {
        const result = await notification_model_1.default.deleteMany({
            receiverId: new mongoose_1.default.Types.ObjectId(receiverId),
        });
        return {
            success: true,
            message: "All notifications deleted",
            data: result,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deleteAllNotification = deleteAllNotification;
// DELETE SINGLE NOTIFICATION
const deleteSingleNotification = async (notificationId) => {
    try {
        // First find and populate the notification
        const notification = await notification_model_1.default.findById(notificationId)
            .populate("senderId", "name email userId picture")
            .populate({
            path: "source.id",
            populate: [
                {
                    path: "doctorId",
                    select: "name email picture doctorInfo",
                    populate: {
                        path: "doctorInfo",
                        model: "DoctorInfo",
                    },
                },
                {
                    path: "patientId",
                    select: "name email picture",
                },
            ],
        });
        if (!notification) {
            return { success: false, message: "Notification not found" };
        }
        // Then delete it
        await notification_model_1.default.findByIdAndDelete(notificationId);
        return {
            success: true,
            message: "Notification deleted",
            data: notification,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deleteSingleNotification = deleteSingleNotification;
