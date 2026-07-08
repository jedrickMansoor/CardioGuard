import { Document, Types } from "mongoose";

export interface IAppointment extends Document {
  date: Date;
  time: string;
  description: string;
  patientId: Types.ObjectId;
  doctorId?: Types.ObjectId;
  status: "completed" | "pending" | "accepted" | "cancelled";
}
