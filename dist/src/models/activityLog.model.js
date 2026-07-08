"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activityLogSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
    },
    action: {
        type: String,
        enum: [
            "report_generated",
            "appointment_booking",
            "appointment_cancellation",
            "appointment_scheduled",
            "doctor_patient_request",
        ],
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    source: {
        id: {
            type: mongoose_1.Schema.Types.ObjectId,
            refPath: "source.type",
            required: false,
        },
        type: {
            type: String,
            enum: ["Appointment", "DoctorPatient", "Report", "User"],
            required: false,
        },
    },
}, {
    timestamps: true,
});
const ActivityLogModel = (0, mongoose_1.model)("ActivityLog", activityLogSchema);
exports.default = ActivityLogModel;
