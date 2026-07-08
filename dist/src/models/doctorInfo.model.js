"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Schema for a single day
const DayScheduleSchema = new mongoose_1.Schema({
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
}, { _id: false });
// Schema for the weekly schedule
const ScheduleSchema = new mongoose_1.Schema({
    sun: { type: DayScheduleSchema, required: true },
    mon: { type: DayScheduleSchema, required: true },
    tue: { type: DayScheduleSchema, required: true },
    wed: { type: DayScheduleSchema, required: true },
    thu: { type: DayScheduleSchema, required: true },
    fri: { type: DayScheduleSchema, required: true },
    sat: { type: DayScheduleSchema, required: true },
}, { _id: false });
// Schema for availability
const AvailabilitySchema = new mongoose_1.Schema({
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
}, { _id: false });
// Main DoctorInfo schema
const DoctorInfoSchema = new mongoose_1.Schema({
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, default: "General Physician" },
    experience: { type: Number, default: 0 },
    hospital: { type: String, default: "CardioGuard Hospital" },
    hospitalAddress: { type: String, default: "Rawalpindi, Pakistan" },
    qualifications: { type: String, default: "MBBS" },
    consultationDuration: { type: Number, default: 30 },
    availability: {
        type: AvailabilitySchema,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("DoctorInfo", DoctorInfoSchema);
