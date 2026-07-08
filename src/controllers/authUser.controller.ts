import { Request, Response } from "express";
import { RegisterInput } from "../interfaces/services/userAuth.interface";
import {
  login,
  register,
  changePassword,
  refreshTheToken,
} from "../services/userAuth.service";

// USER REGISTRATION CONTROLLER
export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[];
    let pictureUrl: string | undefined;

    if (files) {
      if (Array.isArray(files)) {
        pictureUrl = files[0]?.path;
      } else {
        pictureUrl = files.picture?.[0]?.path;
      }
    }

    const userData: RegisterInput = {
      ...req.body,
      picture: pictureUrl,
    };

    const result = await register(userData);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (error: unknown) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

// LOGIN CONTROLLER
export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

// CHANGE PASSWORD CONTROLLER
export const changePasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

    const result = await changePassword(userId, oldPassword, newPassword);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while changing password",
    });
  }
};

// REFRESH TOKEN CONTROLLER
export const refreshTokenController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    const result = await refreshTheToken(refreshToken);
    if (!result.success) {
      res.status(401).json(result);
      return;
    }
    // This will be handled by the refresh token middleware
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while refreshing token",
    });
  }
};
