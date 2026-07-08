"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("../controllers/report.controller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
// CREATE REPORT
// Doctor creates report for a patient
router.post("/patients/:patientId/doctors/:doctorId", multer_1.default.fields([{ name: "xRayImage", maxCount: 1 }]), report_controller_1.createReportController);
// UPDATE REPORT
router.patch("/:reportId", report_controller_1.updateReportController);
// DELETE REPORT
router.delete("/:reportId", report_controller_1.deleteReportController);
// GET ALL REPORTS BY DOCTOR
router.get("/doctors/:doctorId", report_controller_1.getReportsGeneratedByDoctorController);
// GET REPORTS OF A PATIENT BY A DOCTOR
router.get("/patients/:patientId/doctors/:doctorId", report_controller_1.getPatientReportsGeneratedByDoctorController);
// GET REPORT COUNT PER DOCTOR (FOR A PATIENT)
router.get("/patients/:patientId/report-count", report_controller_1.getPatientReportsGeneratedByDoctorCountController);
// GET ALL REPORTS FOR A PATIENT
router.get("/patients/:patientId", report_controller_1.getPatientAllReportsController);
exports.default = router;
