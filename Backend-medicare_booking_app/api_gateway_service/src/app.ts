import express from "express";
import "dotenv/config";
import { createProxyMiddleware } from "http-proxy-middleware";


const app = express();
const port = process.env.PORT || 8080;

const SERVICES = {
  USER_SERVICE: process.env.USER_SERVICE_URL || 'http://user-service:8081',
//   DOCTOR_SERVICE: process.env.DOCTOR_SERVICE_URL || 'http://doctor-service:8082',
//   BOOKING_SERVICE: process.env.BOOKING_SERVICE_URL || 'http://booking-service:8083',
//   NOTIFICATION_SERVICE: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:8084'
};

app.use('/api/users', createProxyMiddleware({
  target: SERVICES.USER_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': ''
  }
}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
