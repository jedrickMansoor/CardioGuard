"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorInfo_controller_1 = require("../controllers/doctorInfo.controller");
const router = express_1.default.Router();
// CREATE DOCTOR INFO
router.post("/doctors/:doctorId", doctorInfo_controller_1.createDoctorInfoController);
// GET DOCTOR INFO
router.get("/doctors/:doctorId", doctorInfo_controller_1.getDoctorInfoController);
// UPDATE DOCTOR INFO
router.put("/doctors/:doctorId", doctorInfo_controller_1.updateDoctorInfoController);
// DELETE DOCTOR INFO
router.delete("/doctors/:doctorId", doctorInfo_controller_1.deleteDoctorInfoController);
// PARTIAL UPDATE DOCTOR INFO
router.patch("/doctors/:doctorId", doctorInfo_controller_1.partialUpdateDoctorInfoController);
exports.default = router;
