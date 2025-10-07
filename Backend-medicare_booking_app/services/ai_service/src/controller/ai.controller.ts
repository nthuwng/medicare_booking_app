// src/controller/ai.controller.ts
import { Request, Response } from "express";
import { dispatchByIntent } from "src/services/ai.registry";
import { parseIntent } from "src/validations/ai.intent";
import type { UploadedImage as UImage } from "src/types/ai.runtime";

const MODEL_AI = process.env.GEMINI_MODEL_NAME!;

export const chatController = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file as UImage | undefined;
    const { prompt = "" } = (req.body || {}) as { prompt?: string };

    // Có ảnh → ép intent image, gửi file qua ctx
    if (file) {
      const image: UImage = {
        ...file,
        base64: file.buffer.toString("base64"), // tiện cho downstream
      };

      const result = await dispatchByIntent(
        {
          intent: "recommend_specialty_image",
          args: { symptoms: prompt },
        } as any,
        { image, prompt, modelImage: MODEL_AI }
      );

      if ((result as any)?.error) {
        res.status(400).json({
          success: false,
          intent: "recommend_specialty_image",
          error: (result as any).error,
        });
        return;
      }

      res.json({
        success: true,
        intent: "recommend_specialty_image",
        model: MODEL_AI,
        text: result?.content ?? "",
        data: result?.data ?? null, // nếu bạn có parse JSON từ text
      });
      return;
    }

    // TEXT → intent → handler
    if (!prompt) {
      res.status(400).json({ error: "message is required" });
    }

    const parsed = await parseIntent(prompt);
    const result = await dispatchByIntent(parsed, { prompt });

    res.json({
      success: true,
      intent: (result as any)?.intent ?? parsed.intent,
      model: MODEL_AI,
      text: result?.content ?? "",
      data: result?.data ?? null,
    });
    return;
  } catch (e: any) {
    res.status(500).json({ error: e.message || "AI error" });
  }
};
