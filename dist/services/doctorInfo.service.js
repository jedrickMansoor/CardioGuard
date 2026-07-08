"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialUpdateDoctorInfo = exports.deleteDoctorInfo = exports.updateDoctorInfo = exports.getDoctorInfo = exports.createDoctorInfo = void 0;
const doctorInfo_model_1 = __importDefault(require("../models/doctorInfo.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// CREATE INFO
const createDoctorInfo = async (data) => {
    try {
        const { doctorId } = data;
        if (!doctorId) {
            return {
                success: false,
                message: "Doctor ID is required",
            };
        }
        const doctor = await user_model_1.default.findById(doctorId);
        if (!doctor) {
            return {
                success: false,
                message: "Doctor not found",
            };
        }
        // Check if doctor already has info
        const existingInfo = await doctorInfo_model_1.default.findOne({ doctorId });
        if (existingInfo) {
            return {
                success: false,
                message: "Doctor info already exists",
            };
        }
        // Ensure availability is set by default if not provided
        if (!data.availability) {
            data.availability = {
                active: true,
                schedule: {
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
                },
            };
        }
        const doctorInfo = new doctorInfo_model_1.default(data);
        await doctorInfo.save();
        return {
            success: true,
            message: "Doctor info created successfully",
            data: doctorInfo,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.createDoctorInfo = createDoctorInfo;
// GET INFO
const getDoctorInfo = async (doctorId) => {
    try {
        const doctorInfo = await doctorInfo_model_1.default.findOne({ doctorId });
        if (!doctorInfo) {
            return {
                success: false,
                message: "Doctor info not found",
            };
        }
        return {
            success: true,
            message: "Doctor info retrieved successfully",
            data: doctorInfo,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.getDoctorInfo = getDoctorInfo;
// UPDATE INFO
const updateDoctorInfo = async (doctorId, data) => {
    try {
        const doctorInfo = await doctorInfo_model_1.default.findOneAndUpdate({ doctorId }, data, { new: true });
        if (!doctorInfo) {
            return {
                success: false,
                message: "Doctor info not found",
            };
        }
        return {
            success: true,
            message: "Doctor info updated successfully",
            data: doctorInfo,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.updateDoctorInfo = updateDoctorInfo;
// DELETE INFO
const deleteDoctorInfo = async (doctorId) => {
    try {
        const doctorInfo = await doctorInfo_model_1.default.findOneAndDelete({ doctorId });
        if (!doctorInfo) {
            return {
                success: false,
                message: "Doctor info not found",
            };
        }
        return {
            success: true,
            message: "Doctor info deleted successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.deleteDoctorInfo = deleteDoctorInfo;
// PARTIAL UPDATE DOCTOR INFO
const partialUpdateDoctorInfo = async (userId, updateData) => {
    try {
        const allowedFields = [
            "specialization",
            "experience",
            "hospital",
            "hospitalAddress",
            "qualifications",
            "consultationDuration",
            "availability",
        ];
        const filteredData = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        }
        const doctorInfo = await doctorInfo_model_1.default.findOneAndUpdate({ doctorId: userId }, { $set: filteredData }, { new: true, runValidators: true });
        if (!doctorInfo) {
            return {
                success: false,
                message: "Doctor info not found",
            };
        }
        const user = await user_model_1.default.findOne({ _id: userId }).populate("doctorInfo");
        return {
            success: true,
            data: user,
            message: "User updated successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.partialUpdateDoctorInfo = partialUpdateDoctorInfo;
