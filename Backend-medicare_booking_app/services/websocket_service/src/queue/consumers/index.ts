

export const initializeAllRabbitMQConsumers = async () => {
  try {
    // await initNotificationRegisterDoctorConsumer();

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
