import cors from "cors";
import express from "express";
import "dotenv/config";
import http from "http";
import testRoutes from "./routes/testRoutes";
import { connectRabbitMQ } from "./queue/connection";
import { initializeAllRabbitMQConsumers } from "./queue/consumers";
import { initSocketIO } from "./socket";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
//config Routes
testRoutes(app);

// Start server
const startApplication = async () => {
  try {
    //Khởi tạo Socket.IO
    initSocketIO(server);

    //Kết nối Message Broker (RabbitMQ)
    await connectRabbitMQ();
    console.log("✅ Connected to RabbitMQ");

    //Khởi tạo tất cả Consumers
    await initializeAllRabbitMQConsumers();
    console.log("✅ All RabbitMQ consumers initialized successfully.");

    //Khởi động HTTP Server với Socket.IO
    server.listen(port, () => {
      console.log(`✅ Websocket_service listening on port ${port}`);
      console.log(`✅ Socket.IO server listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start application:", error);
    process.exit(1); // Thoát ứng dụng nếu có lỗi khởi động quan trọng
  }
};

startApplication(); // Gọi hàm khởi động chính
