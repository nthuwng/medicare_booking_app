import express, { Express } from "express";
import testController from "../controllers/api";

const router = express.Router();

const testRoutes = (app: Express) => {
  router.get("/", testController);

  app.use("/test", router);
};

export default testRoutes;
