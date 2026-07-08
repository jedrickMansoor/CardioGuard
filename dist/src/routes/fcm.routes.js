"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fcm_controller_1 = require("../controllers/fcm.controller");
const router = express_1.default.Router();
// SAVE TOKEN 
router.post("/save-token", fcm_controller_1.saveToken);
// SEND PUSH NOTIFICATION
router.post("/send-notification", fcm_controller_1.sendPush);
exports.default = router;
