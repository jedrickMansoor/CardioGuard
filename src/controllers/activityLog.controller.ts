import { Request, Response } from "express";
import {
  createActivityLog,
  getUserActivityLogs,
  deleteAllActivityLogs,
  deleteSingleActivityLog,
} from "../services/activityLog.service";

export const createActivityLogController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await createActivityLog(req.body);
    if (result.success) {
      return res.status(201).json({ message: result.message, data: result.data });
    }
    return res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserActivityLogsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const result = await getUserActivityLogs(userId);
    if (result.success) {
      return res.status(200).json({ data: result.data });
    }
    return res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAllActivityLogsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const result = await deleteAllActivityLogs(userId);
    if (result.success) {
      return res.status(200).json({ message: result.message, data: result.data });
    }
    return res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSingleActivityLogController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { activityLogId } = req.params;
    const result = await deleteSingleActivityLog(activityLogId);
    if (result.success) {
      return res.status(200).json({ message: result.message, data: result.data });
    }
    return res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
