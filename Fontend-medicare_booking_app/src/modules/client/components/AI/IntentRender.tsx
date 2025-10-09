// IntentRenderer.tsx
import React from "react";
import { SpecialtyRecommendation } from "./SpecialtyRecommendation";
import { SpecialtyDoctorCheck } from "./SpecialtyDoctorCheck";

type Props = { intent?: string | null; text?: string | null; data?: any };

const intentComponentMap: Record<string, React.FC<any>> = {
  recommend_specialty_text: SpecialtyRecommendation,
  specialty_doctor_check: SpecialtyDoctorCheck,
  // thêm intents khác ở đây
};

export default function IntentRenderer({ intent, text, data }: Props) {
  if (!intent) return null;
  const Component = intentComponentMap[intent];
  if (!Component) return null;
  return <Component text={text ?? null} data={data ?? null} />;
}
