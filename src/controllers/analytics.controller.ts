import {
  doctorsAnalytics,
  reportsAppointmentsAnalytics,
} from "../services/analytics.service"

// GET DOCTORS ANALYTICS
export const getDoctorsAnalyticsController = async (req: any, res: any) => {
  const doctorId = req.params.doctorId;
  const analytics = await doctorsAnalytics(doctorId);
  if (analytics.success) {
    return res.status(200).json(analytics);
  } else {
    return res.status(500).json(analytics);
  }
};

// GET REPORTS + APPOINTMENTS LAST 7 DAYS ANALYTICS
export const getReportsAppointmentsAnalyticsController = async (req: any, res: any) => {
  const doctorId = req.params.doctorId;
  const analytics = await reportsAppointmentsAnalytics(doctorId);
  if (analytics.success) {
    return res.status(200).json(analytics);
  } else {
    return res.status(500).json(analytics);
  }
};

