import express, { Express } from "express";
import multer from "multer";
import { chatController } from "src/controller/ai.controller";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const aiRoutes = (app: Express) => {
  router.post("/chat", upload.single("image"), chatController);

  app.use("/v1", router);
};

export default aiRoutes;
