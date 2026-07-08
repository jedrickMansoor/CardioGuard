"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: [
            "report_generated",
            "appointment_booking",
            "appointment_reminder",
            "appointment_cancellation",
            "appointment_scheduled",
            "doctor_patient_request",
            "general",
        ],
        default: "general",
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
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
    seen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema);
exports.default = NotificationModel;
