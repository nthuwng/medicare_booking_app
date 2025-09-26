import { initCreateUserProfileConsumer } from "./createUserProfile.consumer";
import { initGetPatientIdConsumer } from "./patient.getPatientId.consumer";


export const initializeAllRabbitMQConsumers = async () => {
  try {
    await initGetPatientIdConsumer();
    await initCreateUserProfileConsumer();
    
    console.log(
      "✅ All RabbitMQ consumers notification_service initialized successfully."
    );
  } catch (error) {
    console.error(
      "❌ Failed to initialize one or more RabbitMQ consumers:",
      error
    );
    throw error;
  }
};
