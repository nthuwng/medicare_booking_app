import { initAuthConsumer } from "./user.consumer";

export const initializeAllRabbitMQConsumers = async () => {
  try {
    await initAuthConsumer();
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

