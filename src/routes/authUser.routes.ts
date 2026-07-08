import express from "express";
import {
  loginController,
  registerController,
  changePasswordController,
  refreshTokenController,
} from "../controllers/authUser.controller";
import upload from "../middlewares/multer";
const router = express.Router();

// REGISTER
router.post(
  "/register",
  upload.fields([{ name: "picture", maxCount: 1 }]),
  registerController,
);

// LOGIN
router.post("/login", loginController);

// CHANGE PASSWORD
router.patch("/change-password/:userId", changePasswordController);

// REFRESH TOKEN
router.post("/refresh-token", refreshTokenController);

export default router;
