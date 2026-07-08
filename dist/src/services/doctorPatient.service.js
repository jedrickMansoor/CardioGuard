"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPatientByUserId = exports.getPatientsOfDoctor = exports.updateDoctorPatientStatus = exports.removeDoctorFromPatient = exports.assignDoctorToPatient = void 0;
const doctorPatient_model_1 = __importDefault(require("../models/doctorPatient.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// ASSIGN PATIENT
const assignDoctorToPatient = async (doctorId, patientUserId) => {
    try {
        // Find doctor by Mongo ObjectId
        const doctor = await user_model_1.default.findById(doctorId);
        if (!doctor || doctor.role !== "doctor") {
            throw new Error("Invalid doctor ID");
        }
        // Find patient by custom userId
        const patient = await user_model_1.default.findOne({ userId: patientUserId });
        if (!patient || patient.role !== "patient") {
            throw new Error("Invalid patient ID");
        }
        // Check if already assigned
        const isAlreadyAssigned = await doctorPatient_model_1.default.findOne({
            doctorId: doctor._id,
            patientId: patient._id,
        });
        if (isAlreadyAssigned) {
            throw new Error("Doctor is already assigned to this patient");
        }
        const doctorPatient = new doctorPatient_model_1.default({
            doctorId: doctor._id,
            patientId: patient._id,
            status: "requested",
        });
        await doctorPatient.save();
        // Populate the saved document
        const populatedDoctorPatient = await doctorPatient_model_1.default
            .findById(doctorPatient._id)
            .populate({
            path: "doctorId",
            select: "name email userId picture age gender role doctorInfo",
            populate: {
                path: "doctorInfo",
                model: "DoctorInfo",
            },
        })
            .populate({
            path: "patientId",
            select: "name email userId picture age gender",
        });
        return {
            success: true,
            message: "Doctor assigned to patient successfully",
            data: populatedDoctorPatient,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.assignDoctorToPatient = assignDoctorToPatient;
// REMOVE ASSIGNMENT
const removeDoctorFromPatient = async (doctorId, patientId) => {
    try {
        // First find and populate the document
        const doctorPatient = await doctorPatient_model_1.default
            .findOne({ doctorId, patientId })
            .populate({
            path: "doctorId",
            select: "name email userId picture age gender role doctorInfo",
            populate: {
                path: "doctorInfo",
                model: "DoctorInfo",
            },
        })
            .populate({
            path: "patientId",
            select: "name email userId picture age gender",
        });
        if (!doctorPatient) {
            throw new Error("Assignment not found");
        }
        // Then delete it
        await doctorPatient_model_1.default.findOneAndDelete({ doctorId, patientId });
        return {
            success: true,
            message: "Doctor removed from patient successfully",
            data: doctorPatient,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.removeDoctorFromPatient = removeDoctorFromPatient;
// UPDATE DOCTOR PATIENT STATUS
const updateDoctorPatientStatus = async (doctorPatientId, status) => {
    try {
        const doctorPatient = await doctorPatient_model_1.default
            .findByIdAndUpdate(doctorPatientId, { status }, { new: true })
            .populate({
            path: "doctorId",
            select: "name email userId picture age gender role doctorInfo",
            populate: {
                path: "doctorInfo",
                model: "DoctorInfo",
            },
        })
            .populate({
            path: "patientId",
            select: "name email userId picture age gender",
        });
        if (!doctorPatient) {
            throw new Error("Doctor-Patient assignment not found");
        }
        return {
            success: true,
            message: "Status updated successfully",
            data: doctorPatient,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.updateDoctorPatientStatus = updateDoctorPatientStatus;
// GET PATIENTS OF A DOCTOR
const getPatientsOfDoctor = async (doctorId, filter) => {
    try {
        const doctor = await user_model_1.default.findById(doctorId);
        if (!doctor || doctor.role !== "doctor") {
            throw new Error("Invalid doctor ID");
        }
        const patientFilter = {};
        // age range
        if (filter?.age) {
            if (Array.isArray(filter.age)) {
                if (filter.age.length === 2) {
                    const [min, max] = filter.age;
                    patientFilter.age = { $gte: min, $lte: max };
                }
                else if (filter.age.length === 1) {
                    patientFilter.age = { $gte: filter.age[0] };
                }
            }
            else if (typeof filter.age === "number") {
                patientFilter.age = { $gte: filter.age };
            }
        }
        // gender
        if (filter?.gender) {
            if (Array.isArray(filter.gender)) {
                patientFilter.gender = { $in: filter.gender };
            }
            else {
                patientFilter.gender = filter.gender;
            }
        }
        // name
        if (filter?.name) {
            patientFilter.name = { $regex: filter.name, $options: "i" };
        }
        const doctorPatients = await doctorPatient_model_1.default
            .find({ doctorId, status: "approved" })
            .populate({
            path: "doctorId",
            select: "name email userId picture age gender role doctorInfo",
            populate: {
                path: "doctorInfo",
                model: "DoctorInfo",
            },
        })
            .populate({
            path: "patientId",
            select: "name email userId picture age gender",
            match: patientFilter,
        });
        const populatedDoctorPatients = doctorPatients.filter((dp) => dp.patientId !== null && dp.doctorId !== null);
        return {
            success: true,
            message: "Patients retrieved successfully",
            data: populatedDoctorPatients,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.getPatientsOfDoctor = getPatientsOfDoctor;
// ASSIGN PATIENT
const findPatientByUserId = async (patientUserId, doctorId) => {
    try {
        const doctor = await user_model_1.default.findById(doctorId);
        if (!doctor || doctor.role !== "doctor") {
            throw new Error("Invalid doctor ID");
        }
        const patient = await user_model_1.default.findOne({ userId: patientUserId })
            .select("name email picture gender age role userId _id")
            .lean();
        if (!patient || patient.role !== "patient") {
            throw new Error("Invalid patient ID");
        }
        const connected = await doctorPatient_model_1.default.findOne({
            doctorId: doctor._id,
            patientId: patient._id,
        });
        return {
            success: true,
            message: "Patient was found",
            data: patient,
            connected: !!connected,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.findPatientByUserId = findPatientByUserId;
