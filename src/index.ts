import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authUser.routes";
import doctorPatientRoutes from "./routes/doctorPatient.routes";
import reportRoutes from "./routes/report.routes";
import doctorInfoRoutes from "./routes/doctorInfo.routes";
import appointmentRoutes from "./routes/appointment.routes";
import analyticsRoutes from "./routes/analytics.routes";
import userRoutes from "./routes/users.routes";
import notificationRoutes from "./routes/notification.routes";
import activityLogRoutes from "./routes/activityLog.routes";
import fcmRoutes from "./routes/fcm.routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assignment", doctorPatientRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/doctor-info", doctorInfoRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/fcm", fcmRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("CardioGuard Backend is running");
});

export default app;


