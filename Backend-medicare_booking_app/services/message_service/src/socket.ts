// src/socket.ts
import { Server } from "socket.io";
import { prisma } from "./config/client";
import { MessageType, SenderType } from "@prisma/client";
import {
  getDoctorByIdViaRabbitMQ,
  getDoctorUserIdByDoctorIdViaRabbitMQ,
  getPatientByIdViaRabbitMQ,
  publishMsgCreatedEvent,
} from "./queue/publishers/message.publisher";

let io: Server;

const roomUser = (userId: string) => `user-${userId}`;
const roomConv = (id: number) => `conv-${id}`;
const fmtTimeVN = (d: Date) =>
  new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(d);

export const initSocketIO = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-message-room", (userId?: string) => {
      if (!userId) return;
      socket.join(`user-${userId}`);
    });

    socket.on(
      "conversation:join",
      async ({
        conversationId,
        userId,
      }: {
        conversationId?: number;
        userId: string;
      }) => {
        if (!conversationId) return;
        socket.join(`conv-${conversationId}`);

        if (userId) {
          await prisma.message.updateMany({
            where: {
              conversationId,
              isRead: false,
              senderId: { not: userId },
            },
            data: { isRead: true },
          });
        }
      }
    );

    socket.on(
      "message:send",
      async (
        payload: {
          conversationId?: number; // nếu có thì dùng luôn
          patientId?: string; // nếu chưa có conversationId → cần cặp patientId + doctorId
          doctorId?: string;
          senderId: string; // userId (Auth)
          senderType: SenderType; // "PATIENT" | "DOCTOR"
          content: string;
          messageType?: MessageType; // default TEXT
        },
        ack?: (res: {
          ok: boolean;
          error?: string;
          conversationId?: number;
          messageId?: number;
        }) => void
      ) => {
        try {
          // 1) validate tối thiểu
          if (!payload?.content?.trim())
            return ack?.({ ok: false, error: "EMPTY_CONTENT" });
          if (!payload.senderId || !payload.senderType)
            return ack?.({ ok: false, error: "MISSING_SENDER" });

          // 2) tìm/ tạo conversation
          let convId = payload.conversationId;
          if (!convId) {
            if (!payload.patientId || !payload.doctorId) {
              return ack?.({ ok: false, error: "MISSING_PEERS" });
            }
            const existed = await prisma.conversation.findFirst({
              where: {
                patientId: payload.patientId,
                doctorId: payload.doctorId,
                type: "DOCTOR_PATIENT",
              },
            });
            if (existed) {
              convId = existed.id;
              // cập nhật lastMessageAt
              await prisma.conversation.update({
                where: { id: convId },
                data: { lastMessageAt: new Date() },
              });
            } else {
              const created = await prisma.conversation.create({
                data: {
                  patientId: payload.patientId,
                  doctorId: payload.doctorId,
                  type: "DOCTOR_PATIENT",
                  lastMessageAt: new Date(),
                },
              });

              const doctor = await getDoctorUserIdByDoctorIdViaRabbitMQ(
                String(created.doctorId)
              );
              if (!doctor) {
                throw new Error("Doctor not found");
              }

              const doctorUserId = doctor;
              try {
                await publishMsgCreatedEvent(created.patientId, doctorUserId);
              } catch (publishError) {
                console.error(
                  `[Message Service] Failed to publish new message created for ${created.patientId} and ${doctorUserId}:`,
                  publishError
                );
              }
              convId = created.id;
            }
          } else {
            // đã có convId → cập nhật lastMessageAt
            await prisma.conversation.update({
              where: { id: convId },
              data: { lastMessageAt: new Date() },
            });
          }

          // 3) lưu message
          const saved = await prisma.message.create({
            data: {
              conversationId: convId,
              senderId: payload.senderId,
              senderType: payload.senderType,
              messageType: payload.messageType || "TEXT",
              content: payload.content,
              isRead: false,
              isDelivered: true,
            },
          });

          // 4) phát cho room hội thoại (UI chat đang mở)
          const wireMsg = {
            id: saved.id,
            conversationId: convId,
            content: saved.content,
            senderId: saved.senderId,
            senderType: saved.senderType,
            messageType: saved.messageType,
            createdAt: saved.createdAt,
            timestamp: fmtTimeVN(saved.createdAt),
          };
          io.to(roomConv(convId)).emit("message:new", wireMsg);

          let payloadDoctorId;
          let payloadPatientId;

          if (convId) {
            const conv = await prisma.conversation.findUnique({
              where: { id: convId },
              select: { doctorId: true, patientId: true },
            });
            payloadDoctorId = conv?.doctorId;
            payloadPatientId = conv?.patientId;
          }

          // 5) phát cập nhật sidebar cho 2 user phòng user-*
          const doctorUserId = await getDoctorByIdViaRabbitMQ(
            payloadDoctorId || ""
          );
          const patientUserId = await getPatientByIdViaRabbitMQ(
            payloadPatientId || ""
          );

          io.to(roomUser(doctorUserId.userId))
            .to(roomUser(patientUserId.user_id))
            .emit("conversation:updated", {
              conversationId: convId,
              doctorId: payloadDoctorId,
              patientId: payloadPatientId,
              lastMessage: {
                id: saved.id,
                content: saved.content,
                senderId: saved.senderId,
                senderType: saved.senderType,
                messageType: saved.messageType,
                createdAt: saved.createdAt,
                timestamp: fmtTimeVN(saved.createdAt),
              },
              lastMessageAt: saved.createdAt,
            });

          ack?.({ ok: true, conversationId: convId, messageId: saved.id });
        } catch (e) {
          console.error("message:send error:", e);
          ack?.({ ok: false, error: "INTERNAL_ERROR" });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;
