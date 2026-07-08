import { Schema, model } from "mongoose";
import { IActivityLog } from "../interfaces/models/activityLog.interface";

const activityLogSchema = new Schema<IActivityLog>(
  {
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
  },
  {
    timestamps: true,
  },
);

const ActivityLogModel = model<IActivityLog>("ActivityLog", activityLogSchema);

export default ActivityLogModel;
