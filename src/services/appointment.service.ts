import { ISchedule } from "../interfaces/models/doctorInfo.interface";
import appointmentModel from "../models/appointment.model";
import doctorInfoModel from "../models/doctorInfo.model";
import UserModel from "../models/user.model";
import { getDayName } from "../utils/date";
import mongoose from "mongoose";

// CREATE APPOINTMENT
export const createAppointment = async (
  doctorId: string,
  patientId: string,
  data: { date: string; time: string; description?: string },
) => {
  try {
    // Validate doctor and patient
    const doctor = await UserModel.findById(doctorId);
    if (!doctor) return { success: false, message: "Doctor not found" };

    const patient = await UserModel.findById(patientId);
    if (!patient) return { success: false, message: "Patient not found" };

    if (doctor.role !== "doctor") {
      return {
        success: false,
        message: "Provided doctorId does not belong to a doctor",
      };
    }

    if (patient.role !== "patient") {
      return {
        success: false,
        message: "Provided patientId does not belong to a patient",
      };
    }

    // Get doctor's availability
    const docAvailability = await doctorInfoModel
      .findOne({ doctorId })
      .select("availability");
    if (!docAvailability || !docAvailability.availability.active) {
      return {
        success: false,
        message: "Doctor is not available for appointments",
      };
    }

    const { date, time, description } = data;
    if (!date || !time)
      return { success: false, message: "Date and time are required" };

    const dayName = getDayName(date);
    const schedule = docAvailability.availability.schedule as ISchedule;

    const daySchedule = schedule[dayName];
    // Check if doctor has a day off
    if (daySchedule.dayOff || daySchedule.customOff) {
      return { success: false, message: "Doctor is off on this day" };
    }

    // Check if requested time is within doctor's schedule
    if (time < daySchedule.openingTime || time > daySchedule.closingTime) {
      return {
        success: false,
        message: "Selected time is outside doctor's working hours",
      };
    }

    // Check if the slot is already booked
    const existingAppointment = await appointmentModel.findOne({
      doctorId,
      date,
      time,
    });

    if (existingAppointment) {
      return { success: false, message: "This time slot is already booked" };
    }

    // Create the appointment
    const newAppointment = await appointmentModel.create({
      doctorId: new mongoose.Types.ObjectId(doctorId),
      patientId: new mongoose.Types.ObjectId(patientId),
      date,
      time,
      description,
      status: "pending",
    });

    return {
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// GET ALL APPOINTMENTS OF A DOCTOR
const combineDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);

  return d;
};

// Get all appointments of a doctor
export const getDoctorAllAppointments = async (
  doctorId: string,
  filters: any,
) => {
  try {
    if (!doctorId) {
      return { success: false, message: "Doctor ID is required" };
    }

    const query: any = { doctorId };

    // Fetch data from database
    let appointments = await appointmentModel
      .find(query)
      .populate("patientId", "name email picture");

    // Apply date filter with time combination
    if (filters?.timeDate) {
      const today = new Date();

      let start: Date | undefined;
      let end: Date | undefined;

      switch (filters.timeDate) {
        case "today": {
          start = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0,
          );
          end = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
          );
          break;
        }

        case "tomorrow": {
          const t = new Date();
          t.setDate(t.getDate() + 1);

          start = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0);
          end = new Date(
            t.getFullYear(),
            t.getMonth(),
            t.getDate(),
            23,
            59,
            59,
          );
          break;
        }

        case "thisWeek": {
          const startWeek = new Date(today);
          const endWeek = new Date(today);
          endWeek.setDate(today.getDate() + 7);

          start = new Date(
            startWeek.getFullYear(),
            startWeek.getMonth(),
            startWeek.getDate(),
            0,
            0,
            0,
          );
          end = new Date(
            endWeek.getFullYear(),
            endWeek.getMonth(),
            endWeek.getDate(),
            23,
            59,
            59,
          );
          break;
        }
      }

      if (start && end) {
        appointments = appointments.filter((a: any) => {
          const fullDateTime = combineDateTime(new Date(a.date), a.time);
          return fullDateTime >= start && fullDateTime <= end;
        });
      }
    }

    // Apply search filter by patient name
    if (filters?.search) {
      const regex = new RegExp(filters.search, "i");

      appointments = appointments.filter((appointment: any) =>
        regex.test(appointment?.patientId?.name || ""),
      );
    }

    return {
      success: true,
      data: appointments,
      filtersApplied: filters,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// GET ALL APPOINTMENTS OF A PATIENT
export const getPatientAllAppointments = async (patientId: string) => {
  try {
    const appointments = await appointmentModel
      .find({ patientId })
      .populate("doctorId", "name email");
    return { success: true, data: appointments };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// GET UPCOMING APPOINTMENTS OF A PATIENT
export const getUpcomingAppointments = async (patientId: string) => {
  try {
    const now = new Date();

    const appointments = await appointmentModel
      .find({ patientId, status: { $ne: "cancelled" } })
      .populate({
        path: "doctorId",
        select: "name email picture doctorInfo",
        populate: {
          path: "doctorInfo",
          select: "specialization hospital hospitalAddress qualifications",
        },
      });

    // Combine date + time and filter upcoming
    const upcomingAppointments = appointments
      .map((appt) => {
        const [h, m] = appt.time.split(":").map(Number);

        const fullDateTime = new Date(appt.date);
        fullDateTime.setHours(h, m, 0, 0);

        return {
          ...appt.toObject(),
          fullDateTime,
        };
      })
      .filter((appt) => appt.fullDateTime > now)
      .sort((a, b) => a.fullDateTime.getTime() - b.fullDateTime.getTime());

    return { success: true, data: upcomingAppointments };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// GET ALL APPOINTMENTS OF A PATIENT WITH A SPECIFIC DOCTOR
export const getPatientSingleDoctorAppointments = async (
  patientId: string,
  doctorId: string,
) => {
  try {
    const appointments = await appointmentModel
      .find({ patientId, doctorId })
      .populate("doctorId", "name email")
      .populate("patientId", "name email");
    return { success: true, data: appointments };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// UPDATE APPOINTMENT (Partial updates allowed)
export const updateAppointment = async (
  appointmentId: string,
  data: Partial<{
    date: string;
    time: string;
    description: string;
    status: "pending" | "accepted" | "completed" | "cancelled";
  }>,
) => {
  try {
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { $set: data },
      { new: true },
    );
    if (!updatedAppointment)
      return { success: false, message: "Appointment not found" };
    return {
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// DELETE SINGLE APPOINTMENT
export const deleteSingleAppointment = async (appointmentId: string) => {
  try {
    const deleted = await appointmentModel.findByIdAndDelete(appointmentId);
    if (!deleted) return { success: false, message: "Appointment not found" };
    return {
      success: true,
      message: "Appointment deleted successfully",
      data: deleted,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// DELETE ALL APPOINTMENTS OF A DOCTOR
export const deleteDoctorAllAppointments = async (doctorId: string) => {
  try {
    const result = await appointmentModel.deleteMany({ doctorId });
    return {
      success: true,
      message: "All doctor appointments deleted",
      data: result,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// DELETE ALL APPOINTMENTS OF A PATIENT
export const deletePatientAllAppointments = async (patientId: string) => {
  try {
    const result = await appointmentModel.deleteMany({ patientId });
    return {
      success: true,
      message: "All patient appointments deleted",
      data: result,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// DELETE ALL APPOINTMENTS OF A PATIENT WITH A SPECIFIC DOCTOR
export const deletePatientSingleDoctorAppointments = async (
  patientId: string,
  doctorId: string,
) => {
  try {
    const result = await appointmentModel.deleteMany({ patientId, doctorId });
    return {
      success: true,
      message: "Patient's appointments with this doctor deleted",
      data: result,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
