import mongoose, { Document } from "mongoose";

export interface IDoctorPatient extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  status: "requested" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
