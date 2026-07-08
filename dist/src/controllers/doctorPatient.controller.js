"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPatientController = exports.getPatientsForDoctorController = exports.updateDoctorPatientStatusController = exports.removeDoctorFromPatientController = exports.assignDoctorToPatientController = void 0;
const doctorPatient_service_1 = require("../services/doctorPatient.service");
// ASSIGN DOCTOR TO PATIENT
const assignDoctorToPatientController = async (req, res) => {
    try {
        const { doctorId, patientUserId } = req.params;
        if (!doctorId || !patientUserId) {
            res
                .status(400)
                .json({ message: "Doctor ID and Patient User ID are required" });
            return;
        }
        const result = await (0, doctorPatient_service_1.assignDoctorToPatient)(doctorId, patientUserId);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error occurred while assigning doctor to patient" });
    }
};
exports.assignDoctorToPatientController = assignDoctorToPatientController;
// REMOVE DOCTOR FROM PATIENT
const removeDoctorFromPatientController = async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;
        if (!doctorId || !patientId) {
            res
                .status(400)
                .json({ message: "Doctor ID and Patient ID are required" });
            return;
        }
        const result = await (0, doctorPatient_service_1.removeDoctorFromPatient)(doctorId, patientId);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error occurred while removing doctor from patient" });
    }
};
exports.removeDoctorFromPatientController = removeDoctorFromPatientController;
// UPDATE DOCTOR PATIENT STATUS
const updateDoctorPatientStatusController = async (req, res) => {
    try {
        const { doctorPatientId } = req.params;
        const { status } = req.body;
        if (!doctorPatientId || !status) {
            res
                .status(400)
                .json({ message: "Doctor Patient ID and status are required" });
            return;
        }
        const result = await (0, doctorPatient_service_1.updateDoctorPatientStatus)(doctorPatientId, status);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error occurred while updating status" });
    }
};
exports.updateDoctorPatientStatusController = updateDoctorPatientStatusController;
// GET PATIENTS FOR DOCTOR
const getPatientsForDoctorController = async (req, res) => {
    try {
        const { doctorId } = req.params;
        if (!doctorId) {
            res
                .status(400)
                .json({ success: false, message: "Doctor ID is required" });
            return;
        }
        const filters = {};
        // Handle gender
        if (req.query.gender) {
            filters.gender = Array.isArray(req.query.gender)
                ? req.query.gender
                : [req.query.gender.toString()];
        }
        // Handle age
        if (req.query.age) {
            if (Array.isArray(req.query.age)) {
                // convert strings to numbers
                filters.age = req.query.age.map((v) => Number(v));
            }
            else {
                filters.age = [Number(req.query.age)];
            }
        }
        // Handle name search
        if (req.query.name) {
            filters.name = req.query.name.toString();
        }
        // Call service function
        const patients = await (0, doctorPatient_service_1.getPatientsOfDoctor)(doctorId, filters);
        res.status(200).json({ success: true, data: patients });
    }
    catch (error) {
        console.error("Error fetching patients for doctor:", error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching patients for doctor",
        });
    }
};
exports.getPatientsForDoctorController = getPatientsForDoctorController;
// FIND PATIENT BY ITS USERID
const findPatientController = async (req, res) => {
    try {
        const { patientUserId, doctorId } = req.params;
        // await the async function
        const result = await (0, doctorPatient_service_1.findPatientByUserId)(patientUserId, doctorId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching patient",
        });
    }
};
exports.findPatientController = findPatientController;
