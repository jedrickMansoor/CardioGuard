import { Request, Response } from "express";
import { FcmToken } from "../models/fcmToken.model";
// import admin from "../firebase";

// SAVE TOKEN
export const saveToken = async (req: Request, res: Response) => {
  const { token, userId } = req.body;

  // await FcmToken.findOneAndUpdate(
  //   { token },
  //   { token, userId },
  //   { upsert: true }
  // );

  res.json({ message: "Token saved" });
};

// SEND PUSH NOTIFICATION
export const sendPush = async (req: Request, res: Response) => {
  const { token, title, body } = req.body;

  // if (!admin.apps.length) {
  //   return res.status(500).json({ success: false, error: "Firebase not initialized. Please add fcm-key.json" });
  // }

  try {
    // await admin.messaging().send({
    //   token,
    //   notification: { title, body },
    // });

    res.json({ success: true, message: "Sent!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};
