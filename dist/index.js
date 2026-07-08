"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authUser_routes_1 = __importDefault(require("./routes/authUser.routes"));
const doctorPatient_routes_1 = __importDefault(require("./routes/doctorPatient.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const doctorInfo_routes_1 = __importDefault(require("./routes/doctorInfo.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", authUser_routes_1.default);
app.use("/api/assignment", doctorPatient_routes_1.default);
app.use("/api/reports", report_routes_1.default);
app.use("/api/doctor-info", doctorInfo_routes_1.default);
app.use("/api/appointments", appointment_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
// Basic route
app.get("/", (req, res) => {
    res.send("CardioGuard Backend is running");
});
exports.default = app;
