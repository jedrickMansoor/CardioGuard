"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatientSingleDoctorAppointmentsController = exports.deletePatientAllAppointmentsController = exports.deleteDoctorAllAppointmentsController = exports.deleteSingleAppointmentController = exports.updateAppointmentController = exports.getPatientSingleDoctorAppointmentsController = exports.getUpcomingAppointmentsController = exports.getPatientAllAppointmentsController = exports.getDoctorAllAppointmentsController = exports.createAppointmentController = void 0;
const appointment_service_1 = require("../services/appointment.service");
// CREATE APPOINTMENT
const createAppointmentController = async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;
        const result = await (0, appointment_service_1.createAppointment)(doctorId, patientId, req.body);
        if (result.success) {
            res.status(201).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createAppointmentController = createAppointmentController;
// GET ALL DOCTOR APPOINTMENTS
const getDoctorAllAppointmentsController = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const filters = req.query;
        const result = await (0, appointment_service_1.getDoctorAllAppointments)(doctorId, filters);
        if (result.success) {
            res.status(200).json({ data: result });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getDoctorAllAppointmentsController = getDoctorAllAppointmentsController;
// GET ALL PATIENT APPOINTMENTS
const getPatientAllAppointmentsController = async (req, res) => {
    try {
        const { patientId } = req.params;
        const result = await (0, appointment_service_1.getPatientAllAppointments)(patientId);
        if (result.success) {
            res.status(200).json({ data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getPatientAllAppointmentsController = getPatientAllAppointmentsController;
// GET UPCOMING PATIENT APPOINTMENTS WITH ANY DOCTOR
const getUpcomingAppointmentsController = async (req, res) => {
    try {
        const { patientId } = req.params;
        const result = await (0, appointment_service_1.getUpcomingAppointments)(patientId);
        if (result.success) {
            res.status(200).json({ data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUpcomingAppointmentsController = getUpcomingAppointmentsController;
// GET PATIENT'S APPOINTMENTS WITH SINGLE DOCTOR
const getPatientSingleDoctorAppointmentsController = async (req, res) => {
    try {
        const { patientId, doctorId } = req.params;
        const result = await (0, appointment_service_1.getPatientSingleDoctorAppointments)(patientId, doctorId);
        if (result.success) {
            res.status(200).json({ data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getPatientSingleDoctorAppointmentsController = getPatientSingleDoctorAppointmentsController;
// UPDATE APPOINTMENT
const updateAppointmentController = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const result = await (0, appointment_service_1.updateAppointment)(appointmentId, req.body);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateAppointmentController = updateAppointmentController;
// DELETE SINGLE APPOINTMENT
const deleteSingleAppointmentController = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const result = await (0, appointment_service_1.deleteSingleAppointment)(appointmentId);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteSingleAppointmentController = deleteSingleAppointmentController;
// DELETE ALL DOCTOR APPOINTMENTS
const deleteDoctorAllAppointmentsController = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const result = await (0, appointment_service_1.deleteDoctorAllAppointments)(doctorId);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteDoctorAllAppointmentsController = deleteDoctorAllAppointmentsController;
// DELETE ALL PATIENT APPOINTMENTS
const deletePatientAllAppointmentsController = async (req, res) => {
    try {
        const { patientId } = req.params;
        const result = await (0, appointment_service_1.deletePatientAllAppointments)(patientId);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deletePatientAllAppointmentsController = deletePatientAllAppointmentsController;
// DELETE PATIENT'S APPOINTMENTS WITH SINGLE DOCTOR
const deletePatientSingleDoctorAppointmentsController = async (req, res) => {
    try {
        const { patientId, doctorId } = req.params;
        const result = await (0, appointment_service_1.deletePatientSingleDoctorAppointments)(patientId, doctorId);
        if (result.success) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(400).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deletePatientSingleDoctorAppointmentsController = deletePatientSingleDoctorAppointmentsController;
