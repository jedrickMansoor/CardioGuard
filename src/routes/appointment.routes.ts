import express from "express";
const router = express.Router();

import {
  createAppointmentController,
  getDoctorAllAppointmentsController,
  getPatientAllAppointmentsController,
  getPatientSingleDoctorAppointmentsController,
  updateAppointmentController,
  deleteSingleAppointmentController,
  deleteDoctorAllAppointmentsController,
  deletePatientAllAppointmentsController,
  deletePatientSingleDoctorAppointmentsController,
  getUpcomingAppointmentsController,
} from "../controllers/appointment.controller";
import { requireAuth } from "../middlewares/auth.middleware";


router.use(requireAuth);


// CREATE APPOINTMENT
router.post(
  "/doctor/:doctorId/patient/:patientId",
  createAppointmentController,
);

// GET APPOINTMENTS
// Get all appointments of a doctor
router.get("/doctors/:doctorId", getDoctorAllAppointmentsController);

// Get all upcoming appointments for a patient
router.get("/patient/:patientId/upcoming", getUpcomingAppointmentsController);

// Get all appointments of a patient
router.get("/patient/:patientId", getPatientAllAppointmentsController);

// Get all appointments of a patient with a specific doctor
router.get(
  "/patient/:patientId/doctor/:doctorId",
  getPatientSingleDoctorAppointmentsController,
);

// UPDATE APPOINTMENT
router.patch("/:appointmentId", updateAppointmentController);

// DELETE APPOINTMENTS
// Delete a single appointment
router.delete("/:appointmentId", deleteSingleAppointmentController);

// Delete all appointments of a doctor
router.delete("/doctors/:doctorId/all", deleteDoctorAllAppointmentsController);

// Delete all appointments of a patient
router.delete(
  "/patients/:patientId/all",
  deletePatientAllAppointmentsController,
);

// Delete all appointments of a patient with a specific doctor
router.delete(
  "/patients/:patientId/doctors/:doctorId/all",
  deletePatientSingleDoctorAppointmentsController,
);


export default router;
