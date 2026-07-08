import express from "express";
import {
  assignDoctorToPatientController,
  findPatientController,
  getPatientsForDoctorController,
  removeDoctorFromPatientController,
  updateDoctorPatientStatusController,
} from "../controllers/doctorPatient.controller";
import { requireAuth } from "../middlewares/auth.middleware";
const router = express.Router();


router.use(requireAuth);

// ASSIGNE DOCTOR TO PATIENT
router.post(
  "/patients/:patientUserId/doctors/:doctorId",
  assignDoctorToPatientController,
);

// REMOVE DOCTOR FROM PATIENT
router.delete(
  "/patients/:patientId/doctors/:doctorId",
  removeDoctorFromPatientController,
);

// UPDATE DOCTOR PATIENT STATUS
router.patch("/:doctorPatientId/status", updateDoctorPatientStatusController);

// GET PATIENTS OF DOCTOR
router.get("/doctors/:doctorId/patients", getPatientsForDoctorController);

// GET PATIENTS OF DOCTOR
router.get("/patients/:patientUserId/doctors/:doctorId", findPatientController);

export default router;
