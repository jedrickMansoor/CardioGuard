import { getPatientFilter } from "../interfaces/services/doctorPatient.service";
import doctorPatientModel from "../models/doctorPatient.model";
import UserModel from "../models/user.model";

// ASSIGN PATIENT
export const assignDoctorToPatient = async (
  doctorId: string,
  patientUserId: string,
) => {
  try {
    // Find doctor by Mongo ObjectId
    const doctor = await UserModel.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Invalid doctor ID");
    }

    // Find patient by custom userId
    const patient = await UserModel.findOne({ userId: patientUserId });

    if (!patient || patient.role !== "patient") {
      throw new Error("Invalid patient ID");
    }

    // Check if already assigned
    const isAlreadyAssigned = await doctorPatientModel.findOne({
      doctorId: doctor._id,
      patientId: patient._id,
    });

    if (isAlreadyAssigned) {
      throw new Error("Doctor is already assigned to this patient");
    }

    const doctorPatient = new doctorPatientModel({
      doctorId: doctor._id,
      patientId: patient._id,
      status: "requested",
    });

    await doctorPatient.save();

    // Populate the saved document
    const populatedDoctorPatient = await doctorPatientModel
      .findById(doctorPatient._id)
      .populate({
        path: "doctorId",
        select: "name email userId picture age gender role doctorInfo",
        populate: {
          path: "doctorInfo",
          model: "DoctorInfo",
        },
      })
      .populate({
        path: "patientId",
        select: "name email userId picture age gender",
      });

    return {
      success: true,
      message: "Doctor assigned to patient successfully",
      data: populatedDoctorPatient,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// REMOVE ASSIGNMENT
export const removeDoctorFromPatient = async (
  doctorId: string,
  patientId: string,
) => {
  try {
    // First find and populate the document
    const doctorPatient = await doctorPatientModel
      .findOne({ doctorId, patientId })
      .populate({
        path: "doctorId",
        select: "name email userId picture age gender role doctorInfo",
        populate: {
          path: "doctorInfo",
          model: "DoctorInfo",
        },
      })
      .populate({
        path: "patientId",
        select: "name email userId picture age gender",
      });

    if (!doctorPatient) {
      throw new Error("Assignment not found");
    }

    // Then delete it
    await doctorPatientModel.findOneAndDelete({ doctorId, patientId });

    return {
      success: true,
      message: "Doctor removed from patient successfully",
      data: doctorPatient,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// UPDATE DOCTOR PATIENT STATUS
export const updateDoctorPatientStatus = async (
  doctorPatientId: string,
  status: "requested" | "approved" | "rejected",
) => {
  try {
    const doctorPatient = await doctorPatientModel
      .findByIdAndUpdate(doctorPatientId, { status }, { new: true })
      .populate({
        path: "doctorId",
        select: "name email userId picture age gender role doctorInfo",
        populate: {
          path: "doctorInfo",
          model: "DoctorInfo",
        },
      })
      .populate({
        path: "patientId",
        select: "name email userId picture age gender",
      });

    if (!doctorPatient) {
      throw new Error("Doctor-Patient assignment not found");
    }

    return {
      success: true,
      message: "Status updated successfully",
      data: doctorPatient,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// GET PATIENTS OF A DOCTOR
export const getPatientsOfDoctor = async (
  doctorId: string,
  filter?: getPatientFilter,
) => {
  try {
    const doctor = await UserModel.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Invalid doctor ID");
    }

    const patientFilter: any = {};

    // age range
    if (filter?.age) {
      if (Array.isArray(filter.age)) {
        if (filter.age.length === 2) {
          const [min, max] = filter.age;
          patientFilter.age = { $gte: min, $lte: max };
        } else if (filter.age.length === 1) {
          patientFilter.age = { $gte: filter.age[0] };
        }
      } else if (typeof filter.age === "number") {
        patientFilter.age = { $gte: filter.age };
      }
    }

    // gender
    if (filter?.gender) {
      if (Array.isArray(filter.gender)) {
        patientFilter.gender = { $in: filter.gender };
      } else {
        patientFilter.gender = filter.gender;
      }
    }

    // name
    if (filter?.name) {
      patientFilter.name = { $regex: filter.name, $options: "i" };
    }

    const doctorPatients = await doctorPatientModel
      .find({ doctorId, status: "approved" })
      .populate({
        path: "doctorId",
        select: "name email userId picture age gender role doctorInfo",
        populate: {
          path: "doctorInfo",
          model: "DoctorInfo",
        },
      })
      .populate({
        path: "patientId",
        select: "name email userId picture age gender",
        match: patientFilter,
      });

    const populatedDoctorPatients = doctorPatients.filter(
      (dp) => dp.patientId !== null && dp.doctorId !== null,
    );

    return {
      success: true,
      message: "Patients retrieved successfully",
      data: populatedDoctorPatients,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// ASSIGN PATIENT
export const findPatientByUserId = async (patientUserId: string, doctorId: string) => {
  try {
    const doctor = await UserModel.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Invalid doctor ID");
    }

    const patient = await UserModel.findOne({ userId: patientUserId })
      .select("name email picture gender age role userId _id")
      .lean();

    if (!patient || patient.role !== "patient") {
      throw new Error("Invalid patient ID");
    }

    const connected = await doctorPatientModel.findOne({
      doctorId: doctor._id,
      patientId: patient._id,
    });


    return {
      success: true,
      message: "Patient was found",
      data: patient,
      connected: !!connected,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
