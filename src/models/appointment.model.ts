import { Schema, model } from "mongoose";
import { IAppointment } from "../interfaces/models/appointment.interface";

const AppointmentSchema = new Schema<IAppointment>(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["completed", "pending",  "accepted" , "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default model<IAppointment>("Appointment", AppointmentSchema);
