import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  userId: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";
  dateOfBirth?: Date;
  age?: number;
  gender?: string;
  address?: string;
  phoneNumber?: string;
  picture?: string;
  bio?: string;
  doctorInfo?: string;
}
