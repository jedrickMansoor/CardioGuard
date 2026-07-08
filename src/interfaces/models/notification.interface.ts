import mongoose, { Document } from "mongoose";

export type NotificationSourceType = "report" | "user" | "appointment";

export interface INotification extends Document {
  message: string;
  type:
    | "report_generated"
    | "appointment_booking"
    | "appointment_reminder"
    | "appointment_cancellation"
    | "appointment_scheduled"
    | "doctor_patient_request"
    | "general";
    
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  source?: {
    id?: mongoose.Types.ObjectId;
    type?: NotificationSourceType;
  };
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
