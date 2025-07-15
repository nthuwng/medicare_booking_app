

import { initCheckClinicConsumer } from "./checkClinic.consumer";
import { initCheckDoctorConsumer } from "./checkDoctor.consumer";


export const initializeAllRabbitMQConsumers = async () => {
  try {
    await initCheckDoctorConsumer();
    await initCheckClinicConsumer();

    console.log("✅ All RabbitMQ consumers doctor_service initialized successfully.");
  } catch (error) {
    console.error(
      "❌ Failed to initialize one or more RabbitMQ consumers:",
      error
    );
    throw error;
  }
};
