import mongoose, { Document } from "mongoose";

export type ActivitySourceType = "Appointment" | "DoctorPatient" | "Report" | "User";

export interface IActivityLog extends Document {
  message: string;
  action:
    | "report_generated"
    | "appointment_booking"
    | "appointment_cancellation"
    | "appointment_scheduled"
    | "doctor_patient_request";
  userId: mongoose.Types.ObjectId;
  source?: {
    id?: mongoose.Types.ObjectId;
    type?: ActivitySourceType;
  };
  createdAt: Date;
  updatedAt: Date;
}
