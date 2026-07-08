"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleActivityLogController = exports.deleteAllActivityLogsController = exports.getUserActivityLogsController = exports.createActivityLogController = void 0;
const activityLog_service_1 = require("../services/activityLog.service");
const createActivityLogController = async (req, res) => {
    try {
        const result = await (0, activityLog_service_1.createActivityLog)(req.body);
        if (result.success) {
            return res.status(201).json({ message: result.message, data: result.data });
        }
        return res.status(400).json({ message: result.message });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createActivityLogController = createActivityLogController;
const getUserActivityLogsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await (0, activityLog_service_1.getUserActivityLogs)(userId);
        if (result.success) {
            return res.status(200).json({ data: result.data });
        }
        return res.status(400).json({ message: result.message });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserActivityLogsController = getUserActivityLogsController;
const deleteAllActivityLogsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await (0, activityLog_service_1.deleteAllActivityLogs)(userId);
        if (result.success) {
            return res.status(200).json({ message: result.message, data: result.data });
        }
        return res.status(400).json({ message: result.message });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteAllActivityLogsController = deleteAllActivityLogsController;
const deleteSingleActivityLogController = async (req, res) => {
    try {
        const { activityLogId } = req.params;
        const result = await (0, activityLog_service_1.deleteSingleActivityLog)(activityLogId);
        if (result.success) {
            return res.status(200).json({ message: result.message, data: result.data });
        }
        return res.status(400).json({ message: result.message });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteSingleActivityLogController = deleteSingleActivityLogController;
