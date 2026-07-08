import { Request, Response } from "express";
import {
  createNotification,
  getUserAllNotifications,
  getNumberOfUnseenNotification,
  seenAllNotification,
  seenSingleNotification,
  deleteAllNotification,
  deleteSingleNotification,
} from "../services/notification.service";

// CREATE NOTIFICATION
export const createNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await createNotification(req.body);
    if (result.success) {
      res.status(201).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL USER NOTIFICATIONS
export const getUserAllNotificationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const result = await getUserAllNotifications(userId);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET NUMBER OF UNSEEN NOTIFICATIONS
export const getNumberOfUnseenNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const result = await getNumberOfUnseenNotification(userId);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// SEEN ALL NOTIFICATIONS
export const seenAllNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { receiverId } = req.params;
    const result = await seenAllNotification(receiverId);
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// SEEN SINGLE NOTIFICATION
export const seenSingleNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { notificationId } = req.params;
    const result = await seenSingleNotification(notificationId);
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE ALL NOTIFICATIONS
export const deleteAllNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { receiverId } = req.params;
    const result = await deleteAllNotification(receiverId);
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE SINGLE NOTIFICATION
export const deleteSingleNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { notificationId } = req.params;
    const result = await deleteSingleNotification(notificationId);
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
