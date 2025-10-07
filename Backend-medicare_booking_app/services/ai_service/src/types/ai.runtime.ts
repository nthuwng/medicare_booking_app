// src/types/ai.runtime.ts
export type UploadedImage = {
  buffer: Buffer;
  mimetype: string;
  originalname?: string;
  base64?: string; // optional, để tránh toString nhiều lần
};

export interface AiRuntimeCtx {
  prompt?: string;
  image?: UploadedImage;
  modelImage?: string;
  modelText?: string;
  locale?: string;
  timezone?: string;
}
