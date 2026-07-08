"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialUpdateDoctorInfoController = exports.deleteDoctorInfoController = exports.updateDoctorInfoController = exports.getDoctorInfoController = exports.createDoctorInfoController = void 0;
const doctorInfo_service_1 = require("../services/doctorInfo.service");
// CREATE DOCTOR INFO
const createDoctorInfoController = async (req, res) => {
    try {
        const data = { ...req.body, doctorId: req.params.doctorId };
        const result = await (0, doctorInfo_service_1.createDoctorInfo)(data);
        if (result.success) {
            return res.status(201).json(result);
        }
        else {
            return res.status(400).json(result);
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createDoctorInfoController = createDoctorInfoController;
// GET DOCTOR INFO
const getDoctorInfoController = async (req, res) => {
    try {
        const { doctorId } = req.params;
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required",
            });
        }
        const result = await (0, doctorInfo_service_1.getDoctorInfo)(doctorId);
        if (result.success) {
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json(result);
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getDoctorInfoController = getDoctorInfoController;
// UPDATE DOCTOR INFO
const updateDoctorInfoController = async (req, res) => {
    try {
        const { doctorId } = req.params;
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required",
            });
        }
        const result = await (0, doctorInfo_service_1.updateDoctorInfo)(doctorId, req.body);
        if (result.success) {
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json(result);
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateDoctorInfoController = updateDoctorInfoController;
// DELETE DOCTOR INFO
const deleteDoctorInfoController = async (req, res) => {
    try {
        const { doctorId } = req.params;
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required",
            });
        }
        const result = await (0, doctorInfo_service_1.deleteDoctorInfo)(doctorId);
        if (result.success) {
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json(result);
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteDoctorInfoController = deleteDoctorInfoController;
// PARTIAL UPDATE DOCTOR INFO
const partialUpdateDoctorInfoController = async (req, res) => {
    try {
        const { doctorId } = req.params;
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required",
            });
        }
        const result = await (0, doctorInfo_service_1.partialUpdateDoctorInfo)(doctorId, req.body);
        if (result.success) {
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json(result);
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.partialUpdateDoctorInfoController = partialUpdateDoctorInfoController;
