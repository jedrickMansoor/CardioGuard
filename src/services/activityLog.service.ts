import mongoose from "mongoose";
import ActivityLogModel from "../models/activityLog.model";
import UserModel from "../models/user.model";
import { ActivitySourceType } from "../interfaces/models/activityLog.interface";

export const createActivityLog = async (data: {
  userId: string;
  message: string;
  action:
    | "report_generated"
    | "appointment_booking"
    | "appointment_cancellation"
    | "appointment_scheduled"
    | "doctor_patient_request";
  source?: { id?: string; type?: ActivitySourceType };
}) => {
  try {
    const { userId, message, action, source } = data;

    const user = await UserModel.findById(userId);
    if (!user) return { success: false, message: "User not found" };

    const newActivityLog = await ActivityLogModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      message,
      action,
      ...((source?.id || source?.type) && {
        source: {
          ...(source?.id && { id: new mongoose.Types.ObjectId(source.id) }),
          ...(source?.type && { type: source.type }),
        },
      }),
    });

    return {
      success: true,
      message: "Activity log created successfully",
      data: newActivityLog,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getUserActivityLogs = async (userId: string) => {
  try {
    const logs = await ActivityLogModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate("userId", "name email userId picture")
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
      message: "Activity logs retrieved successfully",
      data: logs,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteAllActivityLogs = async (userId: string) => {
  try {
    const result = await ActivityLogModel.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return {
      success: true,
      message: "All activity logs deleted",
      data: result,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteSingleActivityLog = async (activityLogId: string) => {
  try {
    const log = await ActivityLogModel.findById(activityLogId)
      .populate("userId", "name email userId picture")
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

    if (!log) {
      return { success: false, message: "Activity log not found" };
    }

    await ActivityLogModel.findByIdAndDelete(activityLogId);

    return {
      success: true,
      message: "Activity log deleted",
      data: log,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
