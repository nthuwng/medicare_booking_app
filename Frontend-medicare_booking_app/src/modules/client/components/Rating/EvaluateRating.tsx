import { useState, useMemo } from "react";
import {
  Modal,
  Rate,
  Input,
  Typography,
  Divider,
  App,
  ConfigProvider,
  theme as antdTheme,
  type ThemeConfig,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import { createRatingAPI } from "../../services/client.api";
import { useCurrentApp } from "@/components/contexts/app.context";

interface props {
  ratingModalOpen: boolean;
  setRatingModalOpen: (open: boolean) => void;
  userId: string;
  doctorId: string;
}

const { Text } = Typography;

const EvaluateRating = (props: props) => {
  const { ratingModalOpen, setRatingModalOpen, userId, doctorId } = props;
  const [score, setScore] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const { message } = App.useApp();

  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  const canSubmit = useMemo(
    () => score > 0 && content.trim().length > 0,
    [score, content]
  );

  const handleSubmit = async () => {
    if (!userId || !doctorId || !canSubmit) return;
    const res = await createRatingAPI(doctorId, score, content.trim());
    if (res?.data) {
      message.success("Đánh giá thành công");
      setRatingModalOpen(false);
      setScore(0);
      setContent("");
    } else {
      message.error(res?.message || "Gửi đánh giá thất bại");
    }
  };

  // AntD theme local cho modal (đồng bộ dark/light)
  const localTheme: ThemeConfig = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorBgElevated: isDark ? "#0f1b2d" : "#ffffff", // nền hộp modal
      colorText: isDark ? "#e5e7eb" : "#0f172a",
      colorTextSecondary: isDark ? "#9ca3af" : "#64748b",
      colorBorder: isDark ? "#1f2a3a" : "#e5e7eb",
      controlItemBgActive: isDark ? "#0b1220" : "#f5f8ff",
      colorPrimary: "#1677ff",
      borderRadiusLG: 12,
    },
  };

  return (
    <ConfigProvider theme={localTheme}>
      <Modal
        width={650}
        centered
        destroyOnClose
        open={ratingModalOpen}
        title={
          <span className={isDark ? "text-white" : ""}>Đánh giá bác sĩ</span>
        }
        onOk={handleSubmit}
        onCancel={() => setRatingModalOpen(false)}
        okText="Gửi đánh giá"
        cancelText="Hủy"
        okButtonProps={{ disabled: !canSubmit }}
      >
        <div className="space-y-3 pb-4">
          <div className="flex items-center gap-3">
            <Rate
              allowHalf
              value={score}
              onChange={setScore}
              character={<StarFilled />}
              style={{ fontSize: 28 }}
            />
            <Text className={isDark ? "!text-gray-300" : "!text-gray-700"}>
              {score ? `${score.toFixed(1)}/5` : "Chọn số sao"}
            </Text>
          </div>

          <Divider className="!my-2" />

          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            autoSize={{ minRows: 4, maxRows: 6 }}
            maxLength={1000}
            showCount
            className={
              isDark
                ? "bg-[#0b1220] text-gray-100 placeholder:text-gray-400 border border-[#1f2a3a] focus:border-[#355991]"
                : "bg-white text-gray-900 placeholder:text-gray-500"
            }
          />
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default EvaluateRating;
