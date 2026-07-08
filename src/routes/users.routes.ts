import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  partialUpdateUserController,
  updateUserPictureController,
} from "../controllers/users.cotroller";
import upload from "../middlewares/multer";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(requireAuth);

// GET ALL USERS
router.get("/", getAllUsersController);

// GET USER BY ID
router.get("/:userId", getUserByIdController);

// PARTIAL UPDATE USER
router.patch("/:userId", partialUpdateUserController);

// UPDATE USER PICTURE
router.patch(
  "/:userId/picture",
  upload.fields([{ name: "picture", maxCount: 1 }]),
  updateUserPictureController,
);

export default router;
