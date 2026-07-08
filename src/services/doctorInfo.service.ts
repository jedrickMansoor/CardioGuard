import doctorInfoModel from "../models/doctorInfo.model";
import UserModel from "../models/user.model";

// CREATE INFO
export const createDoctorInfo = async (data: any) => {
  try {
    const { doctorId } = data;
    if (!doctorId) {
      return {
        success: false,
        message: "Doctor ID is required",
      };
    }

    const doctor = await UserModel.findById(doctorId);
    if (!doctor) {
      return {
        success: false,
        message: "Doctor not found",
      };
    }

    // Check if doctor already has info
    const existingInfo = await doctorInfoModel.findOne({ doctorId });

    if (existingInfo) {
      return {
        success: false,
        message: "Doctor info already exists",
      };
    }

    // Ensure availability is set by default if not provided
    if (!data.availability) {
      data.availability = {
        active: true,
        schedule: {
          sun: {
            openingTime: "09:00",
            closingTime: "17:00",
            dayOff: false,
            customOff: false,
            dayName: "Sunday",
          },
          mon: {
            openingTime: "09:00",
            closingTime: "17:00",
            dayOff: false,
            customOff: false,
            dayName: "Monday",
          },
          tue: {
            openingTime: "09:00",
            closingTime: "17:00",
            dayOff: false,
            customOff: false,
            dayName: "Tuesday",
          },
          wed: {
            openingTime: "09:00",
            closingTime: "17:00",
            dayOff: false,
            customOff: false,
            dayName: "Wednesday",
          },
          thu: {
            openingTime: "09:00",
            closingTime: "17:00",
            dayOff: false,
            customOff: false,
            dayName: "Thursday",
          },
          fri: {
            openingTime: "09:00",
            closingTime: "17:00",
            dayOff: false,
            customOff: false,
            dayName: "Friday",
          },
          sat: {
            openingTime: "09:00",
            closingTime: "17:00",
            dayOff: false,
            customOff: false,
            dayName: "Saturday",
          },
        },
      };
    }

    const doctorInfo = new doctorInfoModel(data);
    await doctorInfo.save();

    return {
      success: true,
      message: "Doctor info created successfully",
      data: doctorInfo,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// GET INFO
export const getDoctorInfo = async (doctorId: string) => {
  try {
    const doctorInfo = await doctorInfoModel.findOne({ doctorId });
    if (!doctorInfo) {
      return {
        success: false,
        message: "Doctor info not found",
      };
    }
    return {
      success: true,
      message: "Doctor info retrieved successfully",
      data: doctorInfo,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// UPDATE INFO
export const updateDoctorInfo = async (doctorId: string, data: any) => {
  try {
    const doctorInfo = await doctorInfoModel.findOneAndUpdate(
      { doctorId },
      data,
      { new: true },
    );
    if (!doctorInfo) {
      return {
        success: false,
        message: "Doctor info not found",
      };
    }

    return {
      success: true,
      message: "Doctor info updated successfully",
      data: doctorInfo,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// DELETE INFO
export const deleteDoctorInfo = async (doctorId: string) => {
  try {
    const doctorInfo = await doctorInfoModel.findOneAndDelete({ doctorId });
    if (!doctorInfo) {
      return {
        success: false,
        message: "Doctor info not found",
      };
    }

    return {
      success: true,
      message: "Doctor info deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// PARTIAL UPDATE DOCTOR INFO
export const partialUpdateDoctorInfo = async (userId: string, updateData: any) => {
  try {
    const allowedFields = [
      "specialization",
      "experience",
      "hospital",
      "hospitalAddress",
      "qualifications",
      "consultationDuration",
      "availability",
    ];

    const filteredData: any = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const doctorInfo = await doctorInfoModel.findOneAndUpdate(
      { doctorId: userId },
      { $set: filteredData },
      { new: true, runValidators: true },
    );

    if (!doctorInfo) {
      return {
        success: false,
        message: "Doctor info not found",
      };
    }

    const user = await UserModel.findOne({ _id: userId }).populate(
      "doctorInfo",
    );

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
