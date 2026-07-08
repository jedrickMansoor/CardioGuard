import mongoose, { Schema } from "mongoose";
import {
  IAvailability,
  IDaySchedule,
  IDoctorInfo,
  ISchedule,
} from "../interfaces/models/doctorInfo.interface";

// Schema for a single day
const DayScheduleSchema = new Schema<IDaySchedule>(
  {
    openingTime: {
      type: String,
      required: true,
      match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
    },
    closingTime: {
      type: String,
      required: true,
      match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
    },
    dayOff: { type: Boolean, default: false },
    customOff: { type: Boolean, default: false },
  },
  { _id: false },
);

// Schema for the weekly schedule
const ScheduleSchema = new Schema<ISchedule>(
  {
    sun: { type: DayScheduleSchema, required: true },
    mon: { type: DayScheduleSchema, required: true },
    tue: { type: DayScheduleSchema, required: true },
    wed: { type: DayScheduleSchema, required: true },
    thu: { type: DayScheduleSchema, required: true },
    fri: { type: DayScheduleSchema, required: true },
    sat: { type: DayScheduleSchema, required: true },
  },
  { _id: false },
);

// Schema for availability
const AvailabilitySchema = new Schema<IAvailability>(
  {
    active: { type: Boolean, default: true },
    schedule: {
      type: ScheduleSchema,
      required: true,
      default: () => ({
        sun: {
          openingTime: "09:00",
          closingTime: "17:00",
          dayOff: false,
          customOff: false,
          dayName: "Sunday",
        },
        mon: {
          openingTime: "09:00",
          closingTime: "17:00",
          dayOff: false,
          customOff: false,
          dayName: "Monday",
        },
        tue: {
          openingTime: "09:00",
          closingTime: "17:00",
          dayOff: false,
          customOff: false,
          dayName: "Tuesday",
        },
        wed: {
          openingTime: "09:00",
          closingTime: "17:00",
          dayOff: false,
          customOff: false,
          dayName: "Wednesday",
        },
        thu: {
          openingTime: "09:00",
          closingTime: "17:00",
          dayOff: false,
          customOff: false,
          dayName: "Thursday",
        },
        fri: {
          openingTime: "09:00",
          closingTime: "17:00",
          dayOff: false,
          customOff: false,
          dayName: "Friday",
        },
        sat: {
          openingTime: "09:00",
          closingTime: "17:00",
          dayOff: false,
          customOff: false,
          dayName: "Saturday",
        },
      }),
    },
  },
  { _id: false },
);

// Main DoctorInfo schema
const DoctorInfoSchema = new Schema<IDoctorInfo>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, default: "General Physician" },
    experience: { type: Number, default: 0 },
    hospital: { type: String, default: "CardioGuard Hospital" },
    hospitalAddress: { type: String, default: "Rawalpindi, Pakistan" },
    qualifications: { type: String, default: "MBBS" },
    consultationDuration: { type: Number, default: 30 },
    availability: {
      type: AvailabilitySchema,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDoctorInfo>("DoctorInfo", DoctorInfoSchema);
