"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPictureController = exports.partialUpdateUserController = exports.getUserByIdController = exports.getAllUsersController = void 0;
const users_service_1 = require("../services/users.service");
// GET ALL USERS
const getAllUsersController = async (req, res) => {
    const filters = req.query;
    const result = await (0, users_service_1.getAllUsers)(filters);
    if (result.success) {
        return res.status(200).json(result);
    }
    else {
        return res.status(500).json(result);
    }
};
exports.getAllUsersController = getAllUsersController;
// GET USER BY ID
const getUserByIdController = async (req, res) => {
    const { userId } = req.params;
    const result = await (0, users_service_1.getUserById)(userId);
    if (result.success) {
        return res.status(200).json(result);
    }
    else {
        return res.status(404).json(result);
    }
};
exports.getUserByIdController = getUserByIdController;
// PARTIAL UPDATE USER
const partialUpdateUserController = async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
    const result = await (0, users_service_1.partialUpdateUser)(userId, updateData);
    if (result.success) {
        return res.status(200).json(result);
    }
    else {
        return res.status(404).json(result);
    }
};
exports.partialUpdateUserController = partialUpdateUserController;
// UPDATE USER PICTURE
const updateUserPictureController = async (req, res) => {
    try {
        const { userId } = req.params;
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
        if (!pictureUrl) {
            return res.status(400).json({
                success: false,
                message: "Picture file is required",
            });
        }
        const result = await (0, users_service_1.updateUserPicture)(userId, pictureUrl);
        if (result.success) {
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json(result);
        }
    }
    catch (error) {
        console.error("Error updating user picture:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating picture",
        });
    }
};
exports.updateUserPictureController = updateUserPictureController;
