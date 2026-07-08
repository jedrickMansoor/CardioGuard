"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activityLog_controller_1 = require("../controllers/activityLog.controller");
const router = express_1.default.Router();
// router.use(requireAuth);
router.post("/", activityLog_controller_1.createActivityLogController);
router.get("/user/:userId", activityLog_controller_1.getUserActivityLogsController);
router.delete("/user/:userId", activityLog_controller_1.deleteAllActivityLogsController);
router.delete("/single/:activityLogId", activityLog_controller_1.deleteSingleActivityLogController);
exports.default = router;
