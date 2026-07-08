"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = exports.changePasswordController = exports.loginController = exports.registerController = void 0;
const userAuth_service_1 = require("../services/userAuth.service");
// USER REGISTRATION CONTROLLER
const registerController = async (req, res) => {
    try {
        const files = req.files;
        let pictureUrl;
        if (files) {
            if (Array.isArray(files)) {
                pictureUrl = files[0]?.path;
            }
            else {
                pictureUrl = files.picture?.[0]?.path;
            }
        }
        const userData = {
            ...req.body,
            picture: pictureUrl,
        };
        const result = await (0, userAuth_service_1.register)(userData);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred during registration",
        });
    }
};
exports.registerController = registerController;
// LOGIN CONTROLLER
const loginController = async (req, res) => {
    try {
        const result = await (0, userAuth_service_1.login)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login",
        });
    }
};
exports.loginController = loginController;
// CHANGE PASSWORD CONTROLLER
const changePasswordController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;
        if (!userId || !oldPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: "User ID, old password, and new password are required",
            });
            return;
        }
        const result = await (0, userAuth_service_1.changePassword)(userId, oldPassword, newPassword);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while changing password",
        });
    }
};
exports.changePasswordController = changePasswordController;
// REFRESH TOKEN CONTROLLER
const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: "Refresh token is required",
            });
            return;
        }
        const result = await (0, userAuth_service_1.refreshTheToken)(refreshToken);
        if (!result.success) {
            res.status(401).json(result);
            return;
        }
        // This will be handled by the refresh token middleware
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while refreshing token",
        });
    }
};
exports.refreshTokenController = refreshTokenController;
