import { initCreateNotificationConsumer } from "./msgCreateNotification.consumer";

export const initializeAllRabbitMQConsumers = async () => {
  try {
    await initCreateNotificationConsumer();
    console.log(
      "✅ All RabbitMQ consumers doctor_service initialized successfully."
    );
  } catch (error) {
    console.error(
      "❌ Failed to initialize one or more RabbitMQ consumers:",
      error
    );
    throw error;
  }
};
