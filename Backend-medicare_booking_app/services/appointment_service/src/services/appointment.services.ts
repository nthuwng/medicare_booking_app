import { ApprovalStatus } from "@shared/index";
import {
  CheckDoctorOutput,
  CreateAppointmentInput,
} from "@shared/interfaces/appointment";
import { prisma } from "src/config/client";
import {
  checkDoctorViaRabbitMQ,
  checkScheduleViaRabbitMQ,
} from "src/queue/publishers/appointment.publisher";

const createAppointmentService = async (
  body: CreateAppointmentInput,
  userId: string
) => {
  const { doctorId, scheduleId, appointmentDate, appointmentTime, reason } =
    body;

  const checkDoctor: CheckDoctorOutput = await checkDoctorViaRabbitMQ(doctorId);
  if (!checkDoctor || !checkDoctor.doctor) {
    throw new Error("Bác sĩ không tồn tại");
  }

  if (checkDoctor.doctor.approvalStatus !== ApprovalStatus.APPROVED) {
    throw new Error("Bác sĩ chưa được duyệt");
  }

  const checkSchedule = await checkScheduleViaRabbitMQ(scheduleId);

  if (!checkSchedule || !checkSchedule.schedule) {
    throw new Error("Lịch khám không tồn tại");
  }

  if (checkSchedule.schedule.isAvailable === false) {
    throw new Error("Lịch khám đã được đặt");
  }

  const appointment = await prisma.appointment.create({
    data: {
      doctorId: checkDoctor.doctor.id,
      scheduleId: checkSchedule.schedule.id,
      clinicId: checkSchedule.schedule.clinicId,
      patientId: userId,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      reason: reason,
    },
  });

  return appointment;
};

export { createAppointmentService };
