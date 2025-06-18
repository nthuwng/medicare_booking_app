import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.routes";
import { connectRabbitMQ } from "./queue/connection";
import { initializeAllRabbitMQConsumers } from "./queue/consumers";

const app = express();
const port = process.env.PORT || 8086;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
authRoutes(app);


// Start server
const startApplication = async () => {
  try {
      //Kết nối Message Broker (RabbitMQ)
      await connectRabbitMQ();
      console.log("✅ Connected to RabbitMQ");

      //Khởi tạo tất cả Consumers
      await initializeAllRabbitMQConsumers();
      console.log("✅ All RabbitMQ consumers initialized successfully.");

      //Khởi động HTTP Server (hoặc gRPC server)
      app.listen(port, () => {
          console.log(`✅ Auth_service listening on port ${port}`);
      });

  } catch (error) {
      console.error("❌ Failed to start application:", error);
      process.exit(1); // Thoát ứng dụng nếu có lỗi khởi động quan trọng
  }
};

startApplication(); // Gọi hàm khởi động chính