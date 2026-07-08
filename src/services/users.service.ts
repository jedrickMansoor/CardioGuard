import UserModel from "../models/user.model";

// GET ALL USERS
export const getAllUsers = async (filters: any) => {
  try {
    if (filters.role) {
      filters.role = filters.role.toLowerCase();
    }

    const users = await UserModel.find(filters)
      .select("-password")
      .populate("doctorInfo");
    return {
      success: true,
      data: users,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// GET USER BY ID
export const getUserById = async (userId: string) => {
  try {
    const user = await UserModel.findOne({ userId })
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
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// PARTIAL UPDATE USER
export const partialUpdateUser = async (userId: string, updateData: any) => {
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
    const filteredData: any = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    // If dateOfBirth is provided, recalculate age
    if (filteredData.dateOfBirth) {
      const { getAgeFromDOB } = await import("../utils/age");
      filteredData.age = getAgeFromDOB(filteredData.dateOfBirth);
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      filteredData,
      { new: true, runValidators: true },
    ).populate("doctorInfo");

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
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// UPDATE USER PICTURE
export const updateUserPicture = async (userId: string, pictureUrl: string) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { picture: pictureUrl },
      { new: true, runValidators: true },
    ).populate("doctorInfo");

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
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
