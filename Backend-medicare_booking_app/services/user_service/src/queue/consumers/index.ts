import { initCreateUserProfileConsumer } from "./createUserProfile.consumer";
import { initGetPatientIdConsumer } from "./patient.getPatientId.consumer";
import { initGetPatientIdByUserIdConsumer } from "./getPatientIdByUserId";
import { initGetUserProfileByUserIdConsumer } from "./getUserProfileByUserId.consumer";
import { initCreateAdminProfileConsumer } from "./createAdminProfile.consumer";

export const initializeAllRabbitMQConsumers = async () => {
  try {
    await initGetPatientIdConsumer();
    await initCreateUserProfileConsumer();
    await initGetPatientIdByUserIdConsumer();
    await initGetUserProfileByUserIdConsumer();
    await initCreateAdminProfileConsumer();

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
