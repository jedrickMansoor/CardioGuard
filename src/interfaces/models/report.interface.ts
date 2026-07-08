import { Document, Types } from "mongoose";

export interface IReport extends Document {
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;

  xRayImage: string;

  keyFindings: string[];

  heartSize: number;
  normalHeartSize: number;

  risk: "low" | "moderate" | "high" | "critical";

  aiConfidence: number;

  recommendedNextStep: {
    title: string;
    description: string;
  };

  doctorNotes?: string | null;

  status: "pending" | "completed";

  createdAt: Date;
  updatedAt: Date;
}
