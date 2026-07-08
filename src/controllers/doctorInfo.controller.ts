import { Request, Response } from "express";
import {
  createDoctorInfo,
  deleteDoctorInfo,
  getDoctorInfo,
  partialUpdateDoctorInfo,
  updateDoctorInfo,
} from "../services/doctorInfo.service";

// CREATE DOCTOR INFO
export const createDoctorInfoController = async (
  req: Request,
  res: Response,
) => {
  try {
    const data = { ...req.body, doctorId: req.params.doctorId };
    const result = await createDoctorInfo(data);
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET DOCTOR INFO
export const getDoctorInfoController = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }
    const result = await getDoctorInfo(doctorId);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE DOCTOR INFO
export const updateDoctorInfoController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }
    const result = await updateDoctorInfo(doctorId, req.body);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE DOCTOR INFO
export const deleteDoctorInfoController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }
    const result = await deleteDoctorInfo(doctorId);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PARTIAL UPDATE DOCTOR INFO
export const partialUpdateDoctorInfoController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }
    const result = await partialUpdateDoctorInfo(doctorId, req.body);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
