import mongoose, { Schema } from "mongoose";
import { IDoctorPatient } from "../interfaces/models/doctorPatient.interface";

const DoctorPatientSchema = new Schema<IDoctorPatient>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected"],
      default: "requested",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDoctorPatient>(
  "DoctorPatient",
  DoctorPatientSchema,
);
