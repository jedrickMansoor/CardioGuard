import express from "express";
import { saveToken, sendPush } from "../controllers/fcm.controller";

const router = express.Router();

// SAVE TOKEN 
router.post("/save-token", saveToken);

// SEND PUSH NOTIFICATION
router.post("/send-notification", sendPush);

export default router;