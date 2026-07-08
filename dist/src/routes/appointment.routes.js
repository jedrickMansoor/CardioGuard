"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const appointment_controller_1 = require("../controllers/appointment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
router.use(auth_middleware_1.requireAuth);
// CREATE APPOINTMENT
router.post("/doctor/:doctorId/patient/:patientId", appointment_controller_1.createAppointmentController);
// GET APPOINTMENTS
// Get all appointments of a doctor
router.get("/doctors/:doctorId", appointment_controller_1.getDoctorAllAppointmentsController);
// Get all upcoming appointments for a patient
router.get("/patient/:patientId/upcoming", appointment_controller_1.getUpcomingAppointmentsController);
// Get all appointments of a patient
router.get("/patient/:patientId", appointment_controller_1.getPatientAllAppointmentsController);
// Get all appointments of a patient with a specific doctor
router.get("/patient/:patientId/doctor/:doctorId", appointment_controller_1.getPatientSingleDoctorAppointmentsController);
// UPDATE APPOINTMENT
router.patch("/:appointmentId", appointment_controller_1.updateAppointmentController);
// DELETE APPOINTMENTS
// Delete a single appointment
router.delete("/:appointmentId", appointment_controller_1.deleteSingleAppointmentController);
// Delete all appointments of a doctor
router.delete("/doctors/:doctorId/all", appointment_controller_1.deleteDoctorAllAppointmentsController);
// Delete all appointments of a patient
router.delete("/patients/:patientId/all", appointment_controller_1.deletePatientAllAppointmentsController);
// Delete all appointments of a patient with a specific doctor
router.delete("/patients/:patientId/doctors/:doctorId/all", appointment_controller_1.deletePatientSingleDoctorAppointmentsController);
exports.default = router;
