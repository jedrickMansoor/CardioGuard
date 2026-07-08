import { ISchedule } from "../interfaces/models/doctorInfo.interface";

type DayKeys = keyof ISchedule;

export const getDayName = (dateStr: string): DayKeys => {
  const daysOfWeek: DayKeys[] = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];
  const date = new Date(dateStr);
  return daysOfWeek[date.getDay()];
};
