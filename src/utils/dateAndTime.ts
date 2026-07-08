const combineDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);

  return d;
};
