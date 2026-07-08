"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatientSingleDoctorAppointments = exports.deletePatientAllAppointments = exports.deleteDoctorAllAppointments = exports.deleteSingleAppointment = exports.updateAppointment = exports.getPatientSingleDoctorAppointments = exports.getUpcomingAppointments = exports.getPatientAllAppointments = exports.getDoctorAllAppointments = exports.createAppointment = void 0;
const appointment_model_1 = __importDefault(require("../models/appointment.model"));
const doctorInfo_model_1 = __importDefault(require("../models/doctorInfo.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const date_1 = require("../utils/date");
const mongoose_1 = __importDefault(require("mongoose"));
// CREATE APPOINTMENT
const createAppointment = async (doctorId, patientId, data) => {
    try {
        // Validate doctor and patient
        const doctor = await user_model_1.default.findById(doctorId);
        if (!doctor)
            return { success: false, message: "Doctor not found" };
        const patient = await user_model_1.default.findById(patientId);
        if (!patient)
            return { success: false, message: "Patient not found" };
        if (doctor.role !== "doctor") {
            return {
                success: false,
                message: "Provided doctorId does not belong to a doctor",
            };
        }
        if (patient.role !== "patient") {
            return {
                success: false,
                message: "Provided patientId does not belong to a patient",
            };
        }
        // Get doctor's availability
        const docAvailability = await doctorInfo_model_1.default
            .findOne({ doctorId })
            .select("availability");
        if (!docAvailability || !docAvailability.availability.active) {
            return {
                success: false,
                message: "Doctor is not available for appointments",
            };
        }
        const { date, time, description } = data;
        if (!date || !time)
            return { success: false, message: "Date and time are required" };
        const dayName = (0, date_1.getDayName)(date);
        const schedule = docAvailability.availability.schedule;
        const daySchedule = schedule[dayName];
        // Check if doctor has a day off
        if (daySchedule.dayOff || daySchedule.customOff) {
            return { success: false, message: "Doctor is off on this day" };
        }
        // Check if requested time is within doctor's schedule
        if (time < daySchedule.openingTime || time > daySchedule.closingTime) {
            return {
                success: false,
                message: "Selected time is outside doctor's working hours",
            };
        }
        // Check if the slot is already booked
        const existingAppointment = await appointment_model_1.default.findOne({
            doctorId,
            date,
            time,
        });
        if (existingAppointment) {
            return { success: false, message: "This time slot is already booked" };
        }
        // Create the appointment
        const newAppointment = await appointment_model_1.default.create({
            doctorId: new mongoose_1.default.Types.ObjectId(doctorId),
            patientId: new mongoose_1.default.Types.ObjectId(patientId),
            date,
            time,
            description,
            status: "pending",
        });
        return {
            success: true,
            message: "Appointment created successfully",
            data: newAppointment,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.createAppointment = createAppointment;
// GET ALL APPOINTMENTS OF A DOCTOR
const combineDateTime = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);
    return d;
};
// Get all appointments of a doctor
const getDoctorAllAppointments = async (doctorId, filters) => {
    try {
        if (!doctorId) {
            return { success: false, message: "Doctor ID is required" };
        }
        const query = { doctorId };
        // Fetch data from database
        let appointments = await appointment_model_1.default
            .find(query)
            .populate("patientId", "name email picture");
        // Apply date filter with time combination
        if (filters?.timeDate) {
            const today = new Date();
            let start;
            let end;
            switch (filters.timeDate) {
                case "today": {
                    start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                    end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                    break;
                }
                case "tomorrow": {
                    const t = new Date();
                    t.setDate(t.getDate() + 1);
                    start = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0);
                    end = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 23, 59, 59);
                    break;
                }
                case "thisWeek": {
                    const startWeek = new Date(today);
                    const endWeek = new Date(today);
                    endWeek.setDate(today.getDate() + 7);
                    start = new Date(startWeek.getFullYear(), startWeek.getMonth(), startWeek.getDate(), 0, 0, 0);
                    end = new Date(endWeek.getFullYear(), endWeek.getMonth(), endWeek.getDate(), 23, 59, 59);
                    break;
                }
            }
            if (start && end) {
                appointments = appointments.filter((a) => {
                    const fullDateTime = combineDateTime(new Date(a.date), a.time);
                    return fullDateTime >= start && fullDateTime <= end;
                });
            }
        }
        // Apply search filter by patient name
        if (filters?.search) {
            const regex = new RegExp(filters.search, "i");
            appointments = appointments.filter((appointment) => regex.test(appointment?.patientId?.name || ""));
        }
        return {
            success: true,
            data: appointments,
            filtersApplied: filters,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.getDoctorAllAppointments = getDoctorAllAppointments;
// GET ALL APPOINTMENTS OF A PATIENT
const getPatientAllAppointments = async (patientId) => {
    try {
        const appointments = await appointment_model_1.default
            .find({ patientId })
            .populate("doctorId", "name email");
        return { success: true, data: appointments };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getPatientAllAppointments = getPatientAllAppointments;
// GET UPCOMING APPOINTMENTS OF A PATIENT
const getUpcomingAppointments = async (patientId) => {
    try {
        const now = new Date();
        const appointments = await appointment_model_1.default
            .find({ patientId, status: { $ne: "cancelled" } })
            .populate({
            path: "doctorId",
            select: "name email picture doctorInfo",
            populate: {
                path: "doctorInfo",
                select: "specialization hospital hospitalAddress qualifications",
            },
        });
        // Combine date + time and filter upcoming
        const upcomingAppointments = appointments
            .map((appt) => {
            const [h, m] = appt.time.split(":").map(Number);
            const fullDateTime = new Date(appt.date);
            fullDateTime.setHours(h, m, 0, 0);
            return {
                ...appt.toObject(),
                fullDateTime,
            };
        })
            .filter((appt) => appt.fullDateTime > now)
            .sort((a, b) => a.fullDateTime.getTime() - b.fullDateTime.getTime());
        return { success: true, data: upcomingAppointments };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getUpcomingAppointments = getUpcomingAppointments;
// GET ALL APPOINTMENTS OF A PATIENT WITH A SPECIFIC DOCTOR
const getPatientSingleDoctorAppointments = async (patientId, doctorId) => {
    try {
        const appointments = await appointment_model_1.default
            .find({ patientId, doctorId })
            .populate("doctorId", "name email")
            .populate("patientId", "name email");
        return { success: true, data: appointments };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getPatientSingleDoctorAppointments = getPatientSingleDoctorAppointments;
// UPDATE APPOINTMENT (Partial updates allowed)
const updateAppointment = async (appointmentId, data) => {
    try {
        const updatedAppointment = await appointment_model_1.default.findByIdAndUpdate(appointmentId, { $set: data }, { new: true });
        if (!updatedAppointment)
            return { success: false, message: "Appointment not found" };
        return {
            success: true,
            message: "Appointment updated successfully",
            data: updatedAppointment,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.updateAppointment = updateAppointment;
// DELETE SINGLE APPOINTMENT
const deleteSingleAppointment = async (appointmentId) => {
    try {
        const deleted = await appointment_model_1.default.findByIdAndDelete(appointmentId);
        if (!deleted)
            return { success: false, message: "Appointment not found" };
        return {
            success: true,
            message: "Appointment deleted successfully",
            data: deleted,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deleteSingleAppointment = deleteSingleAppointment;
// DELETE ALL APPOINTMENTS OF A DOCTOR
const deleteDoctorAllAppointments = async (doctorId) => {
    try {
        const result = await appointment_model_1.default.deleteMany({ doctorId });
        return {
            success: true,
            message: "All doctor appointments deleted",
            data: result,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deleteDoctorAllAppointments = deleteDoctorAllAppointments;
// DELETE ALL APPOINTMENTS OF A PATIENT
const deletePatientAllAppointments = async (patientId) => {
    try {
        const result = await appointment_model_1.default.deleteMany({ patientId });
        return {
            success: true,
            message: "All patient appointments deleted",
            data: result,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deletePatientAllAppointments = deletePatientAllAppointments;
// DELETE ALL APPOINTMENTS OF A PATIENT WITH A SPECIFIC DOCTOR
const deletePatientSingleDoctorAppointments = async (patientId, doctorId) => {
    try {
        const result = await appointment_model_1.default.deleteMany({ patientId, doctorId });
        return {
            success: true,
            message: "Patient's appointments with this doctor deleted",
            data: result,
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deletePatientSingleDoctorAppointments = deletePatientSingleDoctorAppointments;
