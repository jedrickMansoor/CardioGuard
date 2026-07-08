import mongoose from "mongoose";
import { IFcmToken } from "../interfaces/models/fcmToken.interface";

const tokenSchema = new mongoose.Schema<IFcmToken>({
  userId: { type: String, required: false },
  token: { type: String, required: true },
});

export const FcmToken = mongoose.model<IFcmToken>("FcmToken", tokenSchema);