import NotificationModel from "../models/notification.model";
import UserModel from "../models/user.model";
import mongoose from "mongoose";
import { NotificationSourceType } from "../interfaces/models/notification.interface";

// CREATE NOTIFICATION
export const createNotification = async (data: {
  senderId: string;
  receiverId: string;
  message: string;
  type: string;
  source?: { id?: string; type?: NotificationSourceType };
}) => {
  try {
    const { senderId, receiverId, message, type, source } = data;

    // Validate sender and receiver
    const sender = await UserModel.findById(senderId);
    if (!sender) return { success: false, message: "Sender not found" };

    const receiver = await UserModel.findById(receiverId);
    if (!receiver) return { success: false, message: "Receiver not found" };

    // Create the notification
    const newNotification = await NotificationModel.create({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      message,
      type,
      ...((source?.id || source?.type) && {
        source: {
          ...(source?.id && { id: new mongoose.Types.ObjectId(source.id) }),
          ...(source?.type && { type: source.type }),
        },
      }),
    });

    return {
      success: true,
      message: "Notification created successfully",
      data: newNotification,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// GET USER NOTIFICATIONS
export const getUserAllNotifications = async (userId: string) => {
  try {
    const notifications = await NotificationModel.find({
      receiverId: new mongoose.Types.ObjectId(userId),
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
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// GET NUMBER OF UNSEEN NOTIFICATIONS
export const getNumberOfUnseenNotification = async (userId: string) => {
  try {
    const count = await NotificationModel.countDocuments({
      receiverId: new mongoose.Types.ObjectId(userId),
      seen: false,
    });

    return {
      success: true,
      message: "Unseen notifications count retrieved successfully",
      data: count,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// SEEN ALL NOTIFICATIONS
export const seenAllNotification = async (receiverId: string) => {
  try {
    const result = await NotificationModel.updateMany(
      { receiverId: new mongoose.Types.ObjectId(receiverId), seen: false },
      { seen: true },
    );

    return {
      success: true,
      message: "All notifications marked as seen",
      data: result,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// SEEN SINGLE NOTIFICATION
export const seenSingleNotification = async (notificationId: string) => {
  try {
    const notification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { seen: true },
      { new: true },
    )
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
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// DELETE ALL NOTIFICATIONS
export const deleteAllNotification = async (receiverId: string) => {
  try {
    const result = await NotificationModel.deleteMany({
      receiverId: new mongoose.Types.ObjectId(receiverId),
    });

    return {
      success: true,
      message: "All notifications deleted",
      data: result,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// DELETE SINGLE NOTIFICATION
export const deleteSingleNotification = async (notificationId: string) => {
  try {
    // First find and populate the notification
    const notification = await NotificationModel.findById(notificationId)
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
    await NotificationModel.findByIdAndDelete(notificationId);

    return {
      success: true,
      message: "Notification deleted",
      data: notification,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
