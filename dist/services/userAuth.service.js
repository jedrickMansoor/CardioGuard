"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const age_1 = require("../utils/age");
const hashing_1 = require("../utils/hashing");
const idGenerator_1 = require("../utils/idGenerator");
const token_1 = require("../utils/token");
const doctorInfo_service_1 = require("./doctorInfo.service");
const users_service_1 = require("./users.service");
const register = async (userData) => {
    try {
        const { name, email, password, role = "patient", dateOfBirth, gender, address = null, phoneNumber = null, picture = null, bio = null, } = userData;
        if (!name || !email || !password || !role || !dateOfBirth || !gender) {
            return { success: false, message: "Missing required fields" };
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return { success: false, message: "User already exists" };
        }
        const age = (0, age_1.getAgeFromDOB)(dateOfBirth);
        const hashedPassword = await (0, hashing_1.hashPassword)(password);
        const userId = (0, idGenerator_1.generateUserId)(role);
        // Temporarily set role to patient for creation if doctor
        const createRole = role === "doctor" ? "patient" : role;
        const newUser = await user_model_1.default.create([
            {
                name,
                userId,
                email,
                password: hashedPassword,
                role: createRole,
                dateOfBirth,
                age,
                gender,
                address,
                phoneNumber,
                picture,
                bio,
            },
        ]);
        const createdUser = newUser[0];
        if (role === "doctor") {
            const doctorInfo = await (0, doctorInfo_service_1.createDoctorInfo)({ doctorId: createdUser._id });
            if (!doctorInfo.success) {
                // Delete the user if doctorInfo creation failed
                await user_model_1.default.findByIdAndDelete(createdUser._id);
                return {
                    success: false,
                    message: "Failed to create doctor info",
                };
            }
            const updateResult = await (0, users_service_1.partialUpdateUser)(createdUser._id.toString(), {
                role: "doctor",
                doctorInfo: doctorInfo.data._id.toString(),
            });
            if (!updateResult.success) {
                // Delete the user if update failed
                await user_model_1.default.findByIdAndDelete(createdUser._id);
                return {
                    success: false,
                    message: "Failed to update user with doctor info",
                };
            }
            // Return the updated user
            return {
                success: true,
                message: "User registered successfully",
                user: updateResult.data,
            };
        }
        return {
            success: true,
            message: "User registered successfully",
            user: createdUser,
        };
    }
    catch (error) {
        console.error("Error in registration:", error);
        return {
            success: false,
            message: "An error occurred during registration",
        };
    }
};
exports.register = register;
// LOGIN SERVICE
const login = async (userData) => {
    try {
        const { email, password } = userData;
        // Validate input
        if (!email || !password) {
            return {
                success: false,
                message: "Email and password are required",
            };
        }
        // Find user by email and populate doctorInfo
        const user = await user_model_1.default.findOne({ email }).populate("doctorInfo");
        if (!user) {
            return {
                success: false,
                message: "Invalid email or password",
            };
        }
        // Compare password
        const isPasswordValid = await (0, hashing_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid email or password",
            };
        }
        // Generate token
        const accessToken = (0, token_1.generateAccessToken)({ user, role: user.role });
        // Return success
        return {
            success: true,
            message: "Login successful",
            user,
            accessToken,
            //   accesstoken
        };
    }
    catch (error) {
        console.error("Error in user login:", error);
        return {
            success: false,
            message: "An error occurred during login",
        };
    }
};
exports.login = login;
// CHANGE PASSWORD SERVICE
const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        // Validate input
        if (!userId || !oldPassword || !newPassword) {
            return {
                success: false,
                message: "User ID, old password, and new password are required",
            };
        }
        // Find user by ID
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }
        // Compare old password
        const isPasswordValid = await (0, hashing_1.comparePassword)(oldPassword, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Old password is incorrect",
            };
        }
        // Hash new password
        const hashedPassword = await (0, hashing_1.hashPassword)(newPassword);
        // Update user password
        user.password = hashedPassword;
        await user.save();
        return {
            success: true,
            message: "Password changed successfully",
        };
    }
    catch (error) {
        console.error("Error in change password:", error);
        return {
            success: false,
            message: "An error occurred while changing password",
        };
    }
};
exports.changePassword = changePassword;
