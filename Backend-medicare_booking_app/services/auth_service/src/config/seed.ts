import { hashPassword } from "src/services/auth.services";
import { prisma } from "./client";
import {
  createAdminProfileViaRabbitMQ,
  createUserProfileViaRabbitMQ,
} from "src/queue/publishers/auth.publisher";

const initDatabase = async () => {
  const countUser = await prisma.user.count();

  if (countUser === 0) {
    console.log(">>> INIT DATA AUTH_SERVICE...");
    const hashedPassword = await hashPassword("Nth150603");
    await prisma.user.createMany({
      data: [
        {
          email: "admin@gmail.com",
          password: hashedPassword,
          userType: "ADMIN",
        },
        {
          email: "doctor@gmail.com",
          password: hashedPassword,
          userType: "DOCTOR",
        },
        {
          email: "patient@gmail.com",
          password: hashedPassword,
          userType: "PATIENT",
        },
      ],
    });
  }

  const admin = await prisma.user.findUnique({
    where: {
      email: "admin@gmail.com",
    },
    select: {
      id: true,
      email: true,
    },
  });

  const patient = await prisma.user.findUnique({
    where: {
      email: "patient@gmail.com",
    },
    select: {
      id: true,
      email: true,
    },
  });

  await createUserProfileViaRabbitMQ(patient?.id || "", patient?.email || "");

  await createAdminProfileViaRabbitMQ(admin?.id || "", admin?.email || "");
};

export default initDatabase;
