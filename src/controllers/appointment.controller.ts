import { Request, Response } from "express";
import {
  createAppointment,
  deleteDoctorAllAppointments,
  deletePatientAllAppointments,
  deletePatientSingleDoctorAppointments,
  deleteSingleAppointment,
  getDoctorAllAppointments,
  getPatientAllAppointments,
  getPatientSingleDoctorAppointments,
  getUpcomingAppointments,
  updateAppointment,
} from "../services/appointment.service";

// CREATE APPOINTMENT
export const createAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { doctorId, patientId } = req.params;
    const result = await createAppointment(doctorId, patientId, req.body);
    if (result.success) {
      res.status(201).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL DOCTOR APPOINTMENTS
export const getDoctorAllAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { doctorId } = req.params;
    const filters = req.query;
    const result = await getDoctorAllAppointments(doctorId, filters);
    if (result.success) {
      res.status(200).json({ data: result });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL PATIENT APPOINTMENTS
export const getPatientAllAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { patientId } = req.params;
    const result = await getPatientAllAppointments(patientId);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET UPCOMING PATIENT APPOINTMENTS WITH ANY DOCTOR
export const getUpcomingAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { patientId } = req.params;
    const result = await getUpcomingAppointments(patientId);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET PATIENT'S APPOINTMENTS WITH SINGLE DOCTOR
export const getPatientSingleDoctorAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { patientId, doctorId } = req.params;
    const result = await getPatientSingleDoctorAppointments(
      patientId,
      doctorId,
    );
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE APPOINTMENT
export const updateAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { appointmentId } = req.params;
    const result = await updateAppointment(appointmentId, req.body);
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE SINGLE APPOINTMENT
export const deleteSingleAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { appointmentId } = req.params;
    const result = await deleteSingleAppointment(appointmentId);
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE ALL DOCTOR APPOINTMENTS
export const deleteDoctorAllAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { doctorId } = req.params;
    const result = await deleteDoctorAllAppointments(doctorId);
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE ALL PATIENT APPOINTMENTS
export const deletePatientAllAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { patientId } = req.params;
    const result = await deletePatientAllAppointments(patientId);
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE PATIENT'S APPOINTMENTS WITH SINGLE DOCTOR
export const deletePatientSingleDoctorAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { patientId, doctorId } = req.params;
    const result = await deletePatientSingleDoctorAppointments(
      patientId,
      doctorId,
    );
    if (result.success) {
      res.status(200).json({ message: result.message, data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
