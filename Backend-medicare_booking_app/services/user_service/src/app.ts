import express from "express";
import "dotenv/config";
import adminRoutes from "./routes/admin.routes";
import { initRabbitMQ } from "@shared/utils/rabbitmq";

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form data

// Config Routes
adminRoutes(app);

// Initialize RabbitMQ
initRabbitMQ().catch((err) => {
  console.error("Failed to initialize RabbitMQ:", err);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});
