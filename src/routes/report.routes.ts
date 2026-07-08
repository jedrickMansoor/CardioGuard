import express from "express";
import {
  createReportController,
  updateReportController,
  deleteReportController,
  getReportsGeneratedByDoctorController,
  getPatientReportsGeneratedByDoctorController,
  getPatientReportsGeneratedByDoctorCountController,
  getPatientAllReportsController,
} from "../controllers/report.controller";
import upload from "../middlewares/multer";
import { requireAuth } from "../middlewares/auth.middleware";
const router = express.Router();


router.use(requireAuth);

// CREATE REPORT
// Doctor creates report for a patient
router.post(
  "/patients/:patientId/doctors/:doctorId",
  upload.fields([{ name: "xRayImage", maxCount: 1 }]),
  createReportController,
);

// UPDATE REPORT
router.patch("/:reportId", updateReportController);

// DELETE REPORT
router.delete("/:reportId", deleteReportController);

// GET ALL REPORTS BY DOCTOR
router.get("/doctors/:doctorId", getReportsGeneratedByDoctorController);

// GET REPORTS OF A PATIENT BY A DOCTOR
router.get(
  "/patients/:patientId/doctors/:doctorId",
  getPatientReportsGeneratedByDoctorController,
);

// GET REPORT COUNT PER DOCTOR (FOR A PATIENT)
router.get(
  "/patients/:patientId/report-count",
  getPatientReportsGeneratedByDoctorCountController,
);

// GET ALL REPORTS FOR A PATIENT
router.get("/patients/:patientId", getPatientAllReportsController);

export default router;
