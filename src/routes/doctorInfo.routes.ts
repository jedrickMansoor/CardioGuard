import express from "express";
import {
  createDoctorInfoController,
  deleteDoctorInfoController,
  getDoctorInfoController,
  partialUpdateDoctorInfoController,
  updateDoctorInfoController,
} from "../controllers/doctorInfo.controller";
import { requireAuth } from "../middlewares/auth.middleware";
const router = express.Router();


router.use(requireAuth);
  
// CREATE DOCTOR INFO
router.post("/doctors/:doctorId", createDoctorInfoController);

// GET DOCTOR INFO
router.get("/doctors/:doctorId", getDoctorInfoController);

// UPDATE DOCTOR INFO
router.put("/doctors/:doctorId", updateDoctorInfoController);

// DELETE DOCTOR INFO
router.delete("/doctors/:doctorId", deleteDoctorInfoController);

// PARTIAL UPDATE DOCTOR INFO
router.patch("/doctors/:doctorId", partialUpdateDoctorInfoController);

export default router;
