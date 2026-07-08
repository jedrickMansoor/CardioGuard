"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_cotroller_1 = require("../controllers/users.cotroller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
// GET ALL USERS
router.get("/", users_cotroller_1.getAllUsersController);
// GET USER BY ID
router.get("/:userId", users_cotroller_1.getUserByIdController);
// PARTIAL UPDATE USER
router.patch("/:userId", users_cotroller_1.partialUpdateUserController);
// UPDATE USER PICTURE
router.patch("/:userId/picture", multer_1.default.fields([{ name: "picture", maxCount: 1 }]), users_cotroller_1.updateUserPictureController);
exports.default = router;
