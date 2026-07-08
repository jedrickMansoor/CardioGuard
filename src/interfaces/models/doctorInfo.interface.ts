import mongoose, { Document } from "mongoose";

export interface IDaySchedule {
  openingTime: string;  
  closingTime: string;  
  dayOff: boolean;
  customOff: boolean;
  dayName : string;
}

export interface ISchedule {
  sun: IDaySchedule;
  mon: IDaySchedule;
  tue: IDaySchedule;
  wed: IDaySchedule;
  thu: IDaySchedule;
  fri: IDaySchedule;
  sat: IDaySchedule;
}

export interface IAvailability {
  active: boolean;
  schedule: ISchedule;

}

export interface IDoctorInfo extends Document {
  doctorId: mongoose.Types.ObjectId;
  specialization?: string;
  experience?: number;
  hospital?: string;
  hospitalAddress : string;
  qualifications?: string;
  consultationDuration?: number,
  availability: IAvailability;
  createdAt: Date;
  updatedAt: Date;
}