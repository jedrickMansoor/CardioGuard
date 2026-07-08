import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {
  LoginInput,
  RegisterInput,
} from "../interfaces/services/userAuth.interface";
import UserModel from "../models/user.model";
import { getAgeFromDOB } from "../utils/age";
import { comparePassword, hashPassword } from "../utils/hashing";
import { generateUserId } from "../utils/idGenerator";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { generateUsername } from "../utils/userName";
import { createDoctorInfo } from "./doctorInfo.service";
import { partialUpdateUser } from "./users.service";

interface RefreshTokenPayload {
  userId: string;
  name: string;
  role?: string | null;
  iat?: number;
  exp?: number;
}

// REGISTER SERVICE
export const register = async (userData: RegisterInput) => {
  try {
    const {
      name,
      email,
      password,
      role = "patient",
      dateOfBirth,
      gender,
      address = null,
      phoneNumber = null,
      picture = null,
      bio = null,
    } = userData;

    if (!name || !email || !password || !role || !dateOfBirth || !gender) {
      return { success: false, message: "Missing required fields" };
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    const age = getAgeFromDOB(dateOfBirth);
    const hashedPassword = await hashPassword(password);
    const userId = generateUserId(role);

    // Temporarily set role to patient for creation if doctor
    const createRole = role === "doctor" ? "patient" : role;

    const newUser = await UserModel.create([
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
      const doctorInfo = await createDoctorInfo({ doctorId: createdUser._id });

      if (!doctorInfo.success) {
        // Delete the user if doctorInfo creation failed
        await UserModel.findByIdAndDelete(createdUser._id);
        return {
          success: false,
          message: "Failed to create doctor info",
        };
      }

      const updateResult = await partialUpdateUser(createdUser._id.toString(), {
        role: "doctor",
        doctorInfo: doctorInfo.data!._id.toString(),
      });

      if (!updateResult.success) {
        // Delete the user if update failed
        await UserModel.findByIdAndDelete(createdUser._id);
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
  } catch (error) {
    console.error("Error in registration:", error);
    return {
      success: false,
      message: "An error occurred during registration",
    };
  }
};

// LOGIN SERVICE
export const login = async (userData: LoginInput) => {
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
    const user = await UserModel.findOne({ email }).populate("doctorInfo");
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Generate access token
    const accessToken = generateAccessToken({ user, role: user.role });

    // Generate refresh token
    const refreshToken = generateRefreshToken({ user, role: user.role });

    // Return success
    return {
      success: true,
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error in user login:", error);

    return {
      success: false,
      message: "An error occurred during login",
    };
  }
};

// CHANGE PASSWORD SERVICE
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  try {
    // Validate input
    if (!userId || !oldPassword || !newPassword) {
      return {
        success: false,
        message: "User ID, old password, and new password are required",
      };
    }

    // Find user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Compare old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Old password is incorrect",
      };
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Error in change password:", error);

    return {
      success: false,
      message: "An error occurred while changing password",
    };
  }
};

// REFRESH TOKEN SERVICE
export const refreshTheToken = async (refreshToken: string) => {
  try {
    
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as RefreshTokenPayload;

    const user = await UserModel.findById(decoded.userId).populate(
      "doctorInfo",
    );
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    
    // Generate new access token
    const newAccessToken = generateAccessToken({ user, role: user.role });
    // generate a new refresh token , for now it's optional,
    const newRefreshToken = generateRefreshToken({ user, role: user.role });

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      message: "Token refreshed successfully",
    };
  } catch (error: any) {
    console.error("Error in refreshing token:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
