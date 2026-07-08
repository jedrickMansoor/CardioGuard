"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPicture = exports.partialUpdateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
// GET ALL USERS
const getAllUsers = async (filters) => {
    try {
        if (filters.role) {
            filters.role = filters.role.toLowerCase();
        }
        const users = await user_model_1.default.find(filters)
            .select("-password")
            .populate("doctorInfo");
        return {
            success: true,
            data: users,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.getAllUsers = getAllUsers;
// GET USER BY ID
const getUserById = async (userId) => {
    try {
        const user = await user_model_1.default.findOne({ userId })
            .select("-password")
            .populate("doctorInfo");
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }
        return {
            success: true,
            data: user,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.getUserById = getUserById;
// PARTIAL UPDATE USER
const partialUpdateUser = async (userId, updateData) => {
    try {
        // Define allowed fields for update
        const allowedFields = [
            "name",
            "address",
            "phoneNumber",
            "picture",
            "bio",
            "gender",
            "dateOfBirth",
            "doctorInfo",
            "role",
        ];
        // Filter updateData to only include allowed fields
        const filteredData = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        }
        // If dateOfBirth is provided, recalculate age
        if (filteredData.dateOfBirth) {
            const { getAgeFromDOB } = await Promise.resolve().then(() => __importStar(require("../utils/age")));
            filteredData.age = getAgeFromDOB(filteredData.dateOfBirth);
        }
        const user = await user_model_1.default.findOneAndUpdate({ _id: userId }, filteredData, { new: true, runValidators: true }).populate("doctorInfo");
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }
        return {
            success: true,
            data: user,
            message: "User updated successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.partialUpdateUser = partialUpdateUser;
// UPDATE USER PICTURE
const updateUserPicture = async (userId, pictureUrl) => {
    try {
        const user = await user_model_1.default.findOneAndUpdate({ _id: userId }, { picture: pictureUrl }, { new: true, runValidators: true }).populate("doctorInfo");
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }
        return {
            success: true,
            data: user,
            message: "User picture updated successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.updateUserPicture = updateUserPicture;
