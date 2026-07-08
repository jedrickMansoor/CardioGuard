"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorPatient_controller_1 = require("../controllers/doctorPatient.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.requireAuth);
// ASSIGNE DOCTOR TO PATIENT
router.post("/patients/:patientUserId/doctors/:doctorId", doctorPatient_controller_1.assignDoctorToPatientController);
// REMOVE DOCTOR FROM PATIENT
router.delete("/patients/:patientId/doctors/:doctorId", doctorPatient_controller_1.removeDoctorFromPatientController);
// UPDATE DOCTOR PATIENT STATUS
router.patch("/:doctorPatientId/status", doctorPatient_controller_1.updateDoctorPatientStatusController);
// GET PATIENTS OF DOCTOR
router.get("/doctors/:doctorId/patients", doctorPatient_controller_1.getPatientsForDoctorController);
// GET PATIENTS OF DOCTOR
router.get("/patients/:patientUserId/doctors/:doctorId", doctorPatient_controller_1.findPatientController);
exports.default = router;
