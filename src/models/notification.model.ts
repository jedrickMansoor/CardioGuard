import { Schema, model } from "mongoose";
import { INotification } from "../interfaces/models/notification.interface";

const notificationSchema = new Schema<INotification>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: {
      id: {
        type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema,
);

export default NotificationModel;
