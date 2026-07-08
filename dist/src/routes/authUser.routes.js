"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authUser_controller_1 = require("../controllers/authUser.controller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
// REGISTER
router.post("/register", multer_1.default.fields([{ name: "picture", maxCount: 1 }]), authUser_controller_1.registerController);
// LOGIN
router.post("/login", authUser_controller_1.loginController);
// CHANGE PASSWORD
router.patch("/change-password/:userId", authUser_controller_1.changePasswordController);
// REFRESH TOKEN
router.post("/refresh-token", authUser_controller_1.refreshTokenController);
exports.default = router;
