import { prisma } from "../config/client";
import { getUserByIdViaRabbitMQ } from "../queue/publishers/user.publisher";

export const createAdminProfile = async (body: any) => {
  const { userId, fullName, phone, avatarUrl } = body;

  // Gọi sang auth_service để lấy thông tin user
  const userInfo = await getUserByIdViaRabbitMQ(userId);
  if (!userInfo) throw new Error("User không tồn tại trong auth_service");

  // Kiểm tra xem admin profile đã tồn tại chưa
  const existingAdmin = await prisma.admin.findUnique({
    where: { user_id: userId },
  });

  if (existingAdmin) {
    throw new Error("Admin profile đã tồn tại cho user này");
  }

  const admin = await prisma.admin.create({
    data: {
      user_id: userId,
      full_name: fullName,
      phone,
      avatar_url: avatarUrl,
    },
  });
  return {
    ...admin,
    userInfo,
  };
};
