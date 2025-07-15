import { prisma } from "./client";

const initDatabase = async () => {
  const countTimeSlot = await prisma.timeSlot.count();
  if (countTimeSlot === 0) {
    console.log(">>> INIT DATA SCHEDULE_SERVICE TIME_SLOT...");
    await prisma.timeSlot.createMany({
      data: [
        {
          startTime: new Date(`1970-01-01T08:00:00Z`),
          endTime: new Date(`1970-01-01T09:00:00Z`),
        },
        {
          startTime: new Date(`1970-01-01T09:00:00Z`),
          endTime: new Date(`1970-01-01T10:00:00Z`),
        },
        {
          startTime: new Date(`1970-01-01T10:00:00Z`),
          endTime: new Date(`1970-01-01T11:00:00Z`),
        },
        {
          startTime: new Date(`1970-01-01T11:00:00Z`),
          endTime: new Date(`1970-01-01T12:00:00Z`),
        },
        {
          startTime: new Date(`1970-01-01T13:00:00Z`),
          endTime: new Date(`1970-01-01T14:00:00Z`),
        },
        {
          startTime: new Date(`1970-01-01T14:00:00Z`),
          endTime: new Date(`1970-01-01T15:00:00Z`),
        },
        {
          startTime: new Date(`1970-01-01T15:00:00Z`),
          endTime: new Date(`1970-01-01T16:00:00Z`),
        },
        {
          startTime: new Date(`1970-01-01T16:00:00Z`),
          endTime: new Date(`1970-01-01T17:00:00Z`),
        },
      ],
    });
  }
};

export default initDatabase;
