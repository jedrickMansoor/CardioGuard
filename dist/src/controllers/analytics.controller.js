"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportsAppointmentsAnalyticsController = exports.getDoctorsAnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
// GET DOCTORS ANALYTICS
const getDoctorsAnalyticsController = async (req, res) => {
    const doctorId = req.params.doctorId;
    const analytics = await (0, analytics_service_1.doctorsAnalytics)(doctorId);
    if (analytics.success) {
        return res.status(200).json(analytics);
    }
    else {
        return res.status(500).json(analytics);
    }
};
exports.getDoctorsAnalyticsController = getDoctorsAnalyticsController;
// GET REPORTS + APPOINTMENTS LAST 7 DAYS ANALYTICS
const getReportsAppointmentsAnalyticsController = async (req, res) => {
    const doctorId = req.params.doctorId;
    const analytics = await (0, analytics_service_1.reportsAppointmentsAnalytics)(doctorId);
    if (analytics.success) {
        return res.status(200).json(analytics);
    }
    else {
        return res.status(500).json(analytics);
    }
};
exports.getReportsAppointmentsAnalyticsController = getReportsAppointmentsAnalyticsController;
