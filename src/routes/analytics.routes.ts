import express from "express";
import {
  getDoctorsAnalyticsController,
  getReportsAppointmentsAnalyticsController,
} from "../controllers/analytics.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();


router.get("/doctors/:doctorId", getDoctorsAnalyticsController);
router.get(
  "/doctors/:doctorId/reports-appointments",
  getReportsAppointmentsAnalyticsController,
);

export default router;
