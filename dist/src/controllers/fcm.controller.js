"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPush = exports.saveToken = void 0;
const fcmToken_model_1 = require("../models/fcmToken.model");
const firebase_1 = __importDefault(require("../firebase"));
// SAVE TOKEN
const saveToken = async (req, res) => {
    const { token, userId } = req.body;
    await fcmToken_model_1.FcmToken.findOneAndUpdate({ token }, { token, userId }, { upsert: true });
    res.json({ message: "Token saved" });
};
exports.saveToken = saveToken;
// SEND PUSH NOTIFICATION
const sendPush = async (req, res) => {
    const { token, title, body } = req.body;
    if (!firebase_1.default.apps.length) {
        return res.status(500).json({ success: false, error: "Firebase not initialized. Please add fcm-key.json" });
    }
    try {
        await firebase_1.default.messaging().send({
            token,
            notification: { title, body },
        });
        res.json({ success: true, message: "Sent!" });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};
exports.sendPush = sendPush;
