import { prisma } from "src/config/client";

const createSchedule = async (
  doctorId: string,
  date: string,
  clinicId: number
) => {
  
  return await prisma.schedule.create({
    data: {
      doctorId,
      date: new Date(date),
      clinicId,
      isAvailable: true,
    },
  });
};
export { createSchedule };
