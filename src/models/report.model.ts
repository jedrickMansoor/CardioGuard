import mongoose, { Schema } from "mongoose";
import { IReport } from "../interfaces/models/report.interface";

const reportSchema: Schema<IReport> = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    xRayImage: {
      type: String,
      required: true,
    },

    keyFindings: [
      {
        type: String,
      },
    ],

    heartSize: {
      type: Number,
      required: true,
    },

    normalHeartSize: {
      type: Number,
      required: true,
    },

    risk: {
      type: String,
      enum: ["low", "moderate", "high", "critical"],
      required: true,
    },

    aiConfidence: {
      type: Number,
      min: 0,
      max: 100,
    },

    recommendedNextStep: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },

    doctorNotes: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  },
);

const ReportModel = mongoose.model<IReport>("Report", reportSchema);
export default ReportModel;
