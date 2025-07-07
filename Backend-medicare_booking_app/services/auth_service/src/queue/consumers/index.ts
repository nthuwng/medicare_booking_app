import { initAuthCheckAdminConsumer } from "./authCheckAdmin.consumer";
import { initAuthGetAllUserConsumer } from "./authGetAllUser.consumer";
import { initAuthGetUserConsumer } from "./authGetUser.consumer";
import { initAuthVerifyTokenConsumer } from "./authVerifyToken.consumer";

export const initializeAllRabbitMQConsumers = async () => {
  try {
    await initAuthGetUserConsumer();
    await initAuthVerifyTokenConsumer();
    await initAuthCheckAdminConsumer();
    await initAuthGetAllUserConsumer();
    console.log("✅ 'auth.get_user' consumer initialized.");

    console.log("✅ All RabbitMQ consumers initialized successfully.");
  } catch (error) {
    console.error(
      "❌ Failed to initialize one or more RabbitMQ consumers:",
      error
    );
    throw error;
  }
};
