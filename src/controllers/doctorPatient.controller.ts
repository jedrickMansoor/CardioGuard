import { Request, Response } from "express";
import {
  assignDoctorToPatient,
  findPatientByUserId,
  getPatientsOfDoctor,
  removeDoctorFromPatient,
  updateDoctorPatientStatus,
} from "../services/doctorPatient.service";

// ASSIGN DOCTOR TO PATIENT
export const assignDoctorToPatientController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { doctorId, patientUserId } = req.params;
    if (!doctorId || !patientUserId) {
      res
        .status(400)
        .json({ message: "Doctor ID and Patient User ID are required" });
      return;
    }
    const result = await assignDoctorToPatient(doctorId, patientUserId);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while assigning doctor to patient" });
  }
};

// REMOVE DOCTOR FROM PATIENT
export const removeDoctorFromPatientController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { doctorId, patientId } = req.params;
    if (!doctorId || !patientId) {
      res
        .status(400)
        .json({ message: "Doctor ID and Patient ID are required" });
      return;
    }
    const result = await removeDoctorFromPatient(doctorId, patientId);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res

      .status(500)
      .json({ message: "Error occurred while removing doctor from patient" });
  }
};

// UPDATE DOCTOR PATIENT STATUS
export const updateDoctorPatientStatusController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { doctorPatientId } = req.params;
    const { status } = req.body;
    if (!doctorPatientId || !status) {
      res
        .status(400)
        .json({ message: "Doctor Patient ID and status are required" });
      return;
    }
    const result = await updateDoctorPatientStatus(doctorPatientId, status);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while updating status" });
  }
};

// GET PATIENTS FOR DOCTOR
export const getPatientsForDoctorController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      res
        .status(400)
        .json({ success: false, message: "Doctor ID is required" });
      return;
    }

    const filters: any = {};

    // Handle gender
    if (req.query.gender) {
      filters.gender = Array.isArray(req.query.gender)
        ? req.query.gender
        : [req.query.gender.toString()];
    }

    // Handle age
    if (req.query.age) {
      if (Array.isArray(req.query.age)) {
        // convert strings to numbers
        filters.age = req.query.age.map((v) => Number(v));
      } else {
        filters.age = [Number(req.query.age)];
      }
    }

    // Handle name search
    if (req.query.name) {
      filters.name = req.query.name.toString();
    }

    // Call service function
    const patients = await getPatientsOfDoctor(doctorId, filters);

    res.status(200).json({ success: true, data: patients });
  } catch (error: any) {
    console.error("Error fetching patients for doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching patients for doctor",
    });
  }
};

// FIND PATIENT BY ITS USERID
export const findPatientController = async (req: Request, res: Response) => {
  try {
    const { patientUserId, doctorId } = req.params;

    // await the async function
    const result = await findPatientByUserId(patientUserId, doctorId);

    res.status(200).json(result); 
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching patient",
    });
  }
};
