import express from "express";
import {
  createActivityLogController,
  getUserActivityLogsController,
  deleteAllActivityLogsController,
  deleteSingleActivityLogController,
} from "../controllers/activityLog.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

// router.use(requireAuth);

router.post("/", createActivityLogController);
router.get("/user/:userId", getUserActivityLogsController);
router.delete("/user/:userId", deleteAllActivityLogsController);
router.delete("/single/:activityLogId", deleteSingleActivityLogController);

export default router;
