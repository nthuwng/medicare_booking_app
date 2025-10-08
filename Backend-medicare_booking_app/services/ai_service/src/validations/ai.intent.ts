// src/services/ai.intent.ts
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL_AI = process.env.GEMINI_MODEL_NAME || "gemini-2.0-flash";

export const IntentSchema = z.object({
  intent: z.enum([
    "smalltalk",
    "recommend_specialty_image",
    "recommend_specialty_text",
    "medical_qa",
    "other",
  ]),
  args: z.object({
    symptoms: z.string().nullable().optional(),
  }),
});

export type ParsedIntent = z.infer<typeof IntentSchema>;

// Gom mọi biến thể (text / symptom / info.symptom / args.symptoms) về args.symptoms
function normalizeParsed(raw: any, originalMessage: string): ParsedIntent {
  const intent:
    | "smalltalk"
    | "recommend_specialty_text"
    | "recommend_specialty_image"
    | "medical_qa"
    | "other" = raw?.intent ?? "other";

  const symptomsCandidate =
    raw?.args?.symptoms ??
    raw?.symptoms ??
    raw?.symptom ??
    raw?.text ??
    raw?.info?.symptom ??
    raw?.info?.symptoms ??
    null;

  // Nếu là recommend_specialty_text mà chưa có symptoms, fallback = originalMessage
  const symptoms =
    symptomsCandidate ??
    (intent === "recommend_specialty_text" ? originalMessage : null);

  return { intent, args: { symptoms } };
}

export async function parseIntent(message: string): Promise<ParsedIntent> {
  const sys = `
Bạn là Trợ lý AI MediCare, chỉ hỗ trợ các chủ đề: sức khỏe/y tế cơ bản, gợi ý chuyên khoa, tìm bác sĩ, đặt lịch khám, thông tin dịch vụ trong ứng dụng MediCare. Hãy phân loại intent và trả đúng JSON theo schema.
- smalltalk: chào hỏi ("xin chào", "chào bạn", "hello"...)
- recommend_specialty_text: người dùng mô tả triệu chứng để gợi ý chuyên khoa
- medical_qa: câu hỏi y tế/sức khỏe tổng quát (thuốc, triệu chứng, phòng bệnh, dinh dưỡng...)
- other: mọi thứ còn lại
Yêu cầu: chỉ trả JSON DUY NHẤT theo schema sau (không thêm chữ nào khác).
Schema: ${IntentSchema.toString()}
`;

  const resp = await ai.models.generateContent({
    model: MODEL_AI,
    contents: [{ text: sys }, { text: `Câu hỏi: "${message}"` }],
  });

  const text = (resp as any)?.response?.text?.() ?? (resp as any)?.text ?? "{}";

  const cleanedText = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleanedText);
    return normalizeParsed(parsed, message);
  } catch {
    // Nếu JSON fail, fallback "medical_qa" để vẫn trả lời các câu hỏi y tế
    return { intent: "medical_qa", args: { symptoms: "" } };
  }
}
