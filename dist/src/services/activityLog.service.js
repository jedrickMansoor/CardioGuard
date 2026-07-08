"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleActivityLog = exports.deleteAllActivityLogs = exports.getUserActivityLogs = exports.createActivityLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const activityLog_model_1 = __importDefault(require("../models/activityLog.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const createActivityLog = async (data) => {
    try {
        const { userId, message, action, source } = data;
        const user = await user_model_1.default.findById(userId);
        if (!user)
            return { success: false, message: "User not found" };
        const newActivityLog = await activityLog_model_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            message,
            action,
            ...((source?.id || source?.type) && {
                source: {
                    ...(source?.id && { id: new mongoose_1.default.Types.ObjectId(source.id) }),
                    ...(source?.type && { type: source.type }),
                },
            }),
        });
        return {
            success: true,
            message: "Activity log created successfully",
            data: newActivityLog,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.createActivityLog = createActivityLog;
const getUserActivityLogs = async (userId) => {
    try {
        const logs = await activityLog_model_1.default.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
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
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getUserActivityLogs = getUserActivityLogs;
const deleteAllActivityLogs = async (userId) => {
    try {
        const result = await activityLog_model_1.default.deleteMany({
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        return {
            success: true,
            message: "All activity logs deleted",
            data: result,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deleteAllActivityLogs = deleteAllActivityLogs;
const deleteSingleActivityLog = async (activityLogId) => {
    try {
        const log = await activityLog_model_1.default.findById(activityLogId)
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
        await activityLog_model_1.default.findByIdAndDelete(activityLogId);
        return {
            success: true,
            message: "Activity log deleted",
            data: log,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deleteSingleActivityLog = deleteSingleActivityLog;
