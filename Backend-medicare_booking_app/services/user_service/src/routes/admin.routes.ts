import express, { Express } from "express";
import { createAdminController } from "../controllers/admin.controller";

const router = express.Router();

const adminRoutes = (app: Express) => {
  router.post("/admins", createAdminController);

  app.use("/", router);
};

export default adminRoutes;
