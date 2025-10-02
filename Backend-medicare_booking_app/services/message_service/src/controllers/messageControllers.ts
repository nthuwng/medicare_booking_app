import { Request, Response } from "express";
import {
  getMessagesByConversationIdService,
  getAllConversationsByPatientService,
  getAllConversationsByDoctorService,
  getConversationsByRoleService,
  createOrGetConversationService,
  sendMessageService,
  markMessagesAsReadService,
  getUnreadCountService,
} from "src/services/messageServices";
import {
  getDoctorByIdViaRabbitMQ,
  getPatientByIdViaRabbitMQ,
} from "src/queue/publishers/message.publisher";
import { createConversationService } from "src/repository/message.repo";
import { prisma } from "src/config/client";

const getMessagesByConversationIdAPI = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const messages = await getMessagesByConversationIdService(conversationId);
  if (!messages) {
    res.status(404).json({
      success: false,
      message: "Messages not found",
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: "Messages fetched successfully",
    data: messages,
  });
};

const getAllConversationsPatientAPI = async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const isPatient = await getPatientByIdViaRabbitMQ(patientId);
  if (!isPatient) {
    res.status(404).json({
      success: false,
      message: "Patient not found",
    });
    return;
  }
  const conversations = await getAllConversationsByPatientService(patientId);
  if (!conversations) {
    res.status(404).json({
      success: false,
      message: "Conversations not found",
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: "Conversations fetched successfully",
    data: {
      patient: isPatient,
      conversations: conversations,
    },
  });
};

const getAllConversationsDoctorAPI = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const isDoctor = await getDoctorByIdViaRabbitMQ(doctorId);
  if (!isDoctor) {
    res.status(404).json({
      success: false,
      message: "Patient not found",
    });
    return;
  }
  const conversations = await getAllConversationsByDoctorService(doctorId);
  if (!conversations) {
    res.status(404).json({
      success: false,
      message: "Conversations not found",
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: "Conversations fetched successfully",
    data: {
      doctor: isDoctor,
      conversations: conversations,
    },
  });
};

const createOrGetConversationAPI = async (req: Request, res: Response) => {
  try {
    const { doctorId, patientId } = req.body;

    // Validation đầu vào
    if (!doctorId || !patientId) {
      res.status(400).json({
        success: false,
        message: "doctorId and patientId are required",
      });
    }

    // Kiểm tra doctor và patient có tồn tại không
    const [doctorInfo, patientInfo] = await Promise.all([
      getDoctorByIdViaRabbitMQ(doctorId),
      getPatientByIdViaRabbitMQ(patientId),
    ]);

    if (!doctorInfo) {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!patientInfo) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Tạo hoặc lấy conversation
    const conversation = await createConversationService(patientId, doctorId);

    res.status(200).json({
      success: true,
      message: "Conversation created or retrieved successfully",
      data: {
        conversation: {
          id: conversation.id,
          patientId: conversation.patientId,
          doctorId: conversation.doctorId,
          type: conversation.type,
          createdAt: conversation.createdAt,
          lastMessageAt: conversation.lastMessageAt,
        },
        doctor: doctorInfo,
        patient: patientInfo,
      },
    });
  } catch (error) {
    console.error("❌ Error in createOrGetConversationAPI:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getConversationsByRoleAPI = async (req: Request, res: Response) => {
  try {
    const { role, userId } = req.params;

    // Validation đầu vào
    if (!role || !userId) {
      res.status(400).json({
        success: false,
        message: "role and userId are required",
      });
      return;
    }

    if (role !== "DOCTOR" && role !== "PATIENT") {
      res.status(400).json({
        success: false,
        message: "role must be either DOCTOR or PATIENT",
      });
      return;
    }

    const result = await getConversationsByRoleService(
      role as "DOCTOR" | "PATIENT",
      userId as string
    );

    res.status(200).json({
      success: true,
      message: "Conversations fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in getConversationsByRoleAPI:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const sendMessageAPI = async (req: Request, res: Response) => {
  try {
    const {
      conversationId,
      senderId,
      senderType,
      content,
      messageType,
      fileUrl,
      fileName,
      fileSize,
    } = req.body;

    // Validation đầu vào
    if (
      !conversationId ||
      !senderId ||
      !senderType ||
      !content ||
      !messageType
    ) {
      res.status(400).json({
        success: false,
        message:
          "conversationId, senderId, senderType, content, and messageType are required",
      });
      return;
    }

    // Gửi tin nhắn
    const message = await sendMessageService(
      +conversationId,
      senderId,
      senderType,
      content,
      messageType,
      fileUrl,
      fileName,
      fileSize
    );

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("❌ Error in sendMessageAPI:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const markMessagesAsReadAPI = async (req: Request, res: Response) => {
  try {
    const { conversationId, userId } = req.body;

    // Validation đầu vào
    if (!conversationId || !userId) {
      res.status(400).json({
        success: false,
        message: "conversationId and userId are required",
      });
      return;
    }

    // Đánh dấu tin nhắn đã đọc
    const result = await markMessagesAsReadService(+conversationId, userId);

    res.status(200).json({
      success: true,
      message: "Messages marked as read successfully",
      data: {
        conversationId: result.conversationId,
        updatedCount: result.updatedCount,
        messages: result.messages,
      },
    });
  } catch (error) {
    console.error("❌ Error in markMessagesAsReadAPI:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUnreadCountAPI = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Validation đầu vào
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "userId is required",
      });
      return;
    }

    // Lấy số lượng tin nhắn chưa đọc
    const unreadData = await getUnreadCountService(userId as string);

    res.status(200).json({
      success: true,
      message: "Unread count retrieved successfully",
      data: unreadData,
    });
  } catch (error) {
    console.error("❌ Error in getUnreadCountAPI:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export {
  getMessagesByConversationIdAPI,
  getAllConversationsPatientAPI,
  getAllConversationsDoctorAPI,
  createOrGetConversationAPI,
  getConversationsByRoleAPI,
  sendMessageAPI,
  markMessagesAsReadAPI,
  getUnreadCountAPI,
};
