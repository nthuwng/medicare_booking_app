// src/pages/AIPage.tsx
import { useState, useRef, useEffect } from "react";
import {
  Layout,
  Card,
  Typography,
  Input,
  Button,
  Space,
  Row,
  Col,
  App,
  Spin,
  Upload,
  Modal,
} from "antd";
import { ArrowUpOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getAIServicesAPI,
  recommendSpecialtyFromImageAPI,
} from "../services/client.api";
import ClientHeader from "@/components/layout/ClientLayout/ClientHeader";
import { FiPaperclip } from "react-icons/fi";

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  imageUrl?: string;
}

const AIPage = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { message: antdMessage } = App.useApp();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onPickImage = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    return false; // chặn Upload auto-upload
  };

  const clearPickedImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    } else {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Cuộn tới 1 message cụ thể (khi bạn vừa gửi)
  const scrollToMessage = (id: string) => {
    const c = messagesContainerRef.current;
    const el = document.getElementById(`msg-${id}`);
    if (c && el) {
      const top = el.offsetTop - c.offsetTop; // vị trí của message trong container
      c.scrollTo({ top, behavior: "smooth" });
    } else {
      el?.scrollIntoView({ behavior: "smooth", block: "end" }); // fallback
    }
  };

  const isNearBottom = () => {
    const c = messagesContainerRef.current;
    if (!c) return true;
    return c.scrollTop + c.clientHeight >= c.scrollHeight - 100;
  };

  const handleSendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed && !imageFile) return;

    if (!hasStarted) setHasStarted(true);

    // Hiển thị message của user (kèm ảnh preview nếu có)
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: trimmed || (imageFile ? "" : ""),
      timestamp: new Date(),
      imageUrl: imageFile ? imagePreview || undefined : undefined,
    };
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInputValue("");
    setIsLoading(true);
    // cuộn tới bubble user vừa thêm
    setTimeout(() => {
      scrollToMessage(userMessage.id);
    }, 0);

    try {
      let aiText = "";

      if (imageFile) {
        // Gọi API form-data
        const res = await recommendSpecialtyFromImageAPI(imageFile, trimmed);
        aiText = res?.text || "";
      } else {
        // Gọi API text cũ
        const response = await getAIServicesAPI(trimmed);
        aiText = response?.text || "";
      }

      // Nếu backend trả JSON string trong "text", parse đẹp hơn
      let display = aiText;
      try {
        const obj = JSON.parse(aiText);
        // tuỳ bạn format:
        display =
          `🩺 Chuyên khoa: ${obj.specialty ?? obj.speciality ?? "—"}\n` +
          `✅ Độ tự tin: ${obj.confidence ?? "—"}\n` +
          `${obj.reasoning ?? obj.explanation ?? ""}`;
      } catch {
        // không phải JSON → giữ nguyên
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessage.id
            ? { ...m, content: display, isLoading: false }
            : m
        )
      );
      setImageFile(null);
      setTimeout(scrollToBottom, 50);
    } catch (e: any) {
      console.error(e);
      antdMessage.error("Gọi AI thất bại, vui lòng thử lại.");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessage.id
            ? {
                ...m,
                content:
                  "Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
                isLoading: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      clearPickedImage();
    }
  };

  useEffect(() => {
    if (isNearBottom()) scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (hasStarted) setTimeout(scrollToBottom, 0);
  }, [hasStarted]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e7e5e4 0%, #f5f5f4 100%)",
        }}
        className="!flex  !flex-row"
      >
        <ClientHeader />
        <Content
          style={{
            padding: "24px",
            position: "relative",
            marginTop: "70px",
            zIndex: 1,
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
          className=""
        >
          {/* Landing hero (pre-chat) */}
          {!hasStarted ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "70vh",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <Title
                level={2}
                className="!text-4xl md:!text-4xl !leading-[1.2]"
              >
                <span
                  className="inline-block pb-[2px]                  // thêm chút đáy cho descender
               bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-400
               bg-clip-text text-transparent"
                >
                  Trợ lí tìm thông tin về sức khỏe
                </span>
              </Title>
              <Paragraph className="!text-stone-600 !text-base md:!text-lg !text-center !max-w-3xl">
                Hỏi đáp y tế, gợi ý chuyên khoa, đặt lịch khám và hơn thế nữa.
                Bạn có thể mô tả triệu chứng hoặc tải ảnh để nhận tư vấn chính
                xác hơn.
              </Paragraph>
              <div
                style={{
                  width: "min(900px, 95%)",
                  background: "#ffffff",
                  borderRadius: 24,
                  padding: 12,
                  border: "1px solid #e7e5e4",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {imagePreview && (
                    <div style={{ marginBottom: 4 }}>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          borderRadius: 16,
                          overflow: "hidden",
                          border: "1px solid #e7e5e4",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="preview"
                          style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            display: "flex",
                            gap: 6,
                          }}
                        >
                          <Button
                            size="small"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => setIsImageViewerOpen(true)}
                          />
                          <Button
                            size="small"
                            danger
                            shape="circle"
                            icon={<CloseOutlined />}
                            onClick={clearPickedImage}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <TextArea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Hãy hỏi tôi về sức khỏe, chuyên khoa, đặt lịch, y tế..."
                    autoSize={{ minRows: 1, maxRows: 10 }}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#111827",
                      paddingTop: 4,
                      fontSize: "20px",
                      outline: "none",
                      boxShadow: "none",
                    }}
                    className="!no-scrollbar !mb-2 focus:!outline-none focus:!shadow-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Upload
                        beforeUpload={onPickImage}
                        showUploadList={false}
                        accept="image/*"
                      >
                        <Button
                          shape="circle"
                          icon={<FiPaperclip size={18} />}
                          className="!size-10 hover:!bg-gray-100"
                          title="Tải ảnh lên"
                        />
                      </Upload>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        shape="circle"
                        icon={<ArrowUpOutlined />}
                        onClick={() => handleSendMessage(inputValue)}
                        loading={isLoading}
                        disabled={
                          isLoading || (!inputValue.trim() && !imageFile)
                        }
                        className="!size-10 hover:!bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                open={isImageViewerOpen}
                onCancel={() => setIsImageViewerOpen(false)}
                footer={null}
                centered
                width={600}
                bodyStyle={{ padding: 0, textAlign: "center" }}
              >
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview-full"
                    style={{ maxWidth: "100%", display: "block" }}
                  />
                )}
              </Modal>
            </div>
          ) : (
            <>
              <div className="!mt-[100px]">
                <Row gutter={[0, 0]}>
                  <Col span={24}>
                    <Card
                      style={{
                        height: "70vh",
                        background: "rgba(250, 250, 249, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "none",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                      }}
                      bodyStyle={{
                        padding: 0,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Chat Messages */}
                      <div
                        ref={messagesContainerRef}
                        style={{
                          flex: 1,
                          overflowY: "auto",
                          padding: "24px",
                          background:
                            "linear-gradient(to bottom, #fafaf9, #f5f5f4)",
                        }}
                      >
                        {messages.map((msg) => (
                          <div
                            id={`msg-${msg.id}`}
                            key={msg.id}
                            style={{
                              display: "flex",
                              justifyContent:
                                msg.type === "user" ? "flex-end" : "flex-start",
                              marginBottom: "16px",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                maxWidth: "75%",
                                background:
                                  msg.type === "user"
                                    ? "linear-gradient(135deg, #57534e 0%, #44403c 100%)"
                                    : "#ffffff",
                                color:
                                  msg.type === "user" ? "white" : "#1f2937",
                                padding: "12px 16px",
                                borderRadius:
                                  msg.type === "user"
                                    ? "18px 18px 4px 18px"
                                    : "18px 18px 18px 4px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                border:
                                  msg.type === "ai"
                                    ? "1px solid #e7e5e4"
                                    : "none",
                              }}
                            >
                              {msg.isLoading ? (
                                <Space>
                                  <Spin size="small" />
                                  <Text
                                    style={{
                                      color:
                                        msg.type === "user"
                                          ? "white"
                                          : "#6b7280",
                                    }}
                                  >
                                    AI đang suy nghĩ...
                                  </Text>
                                </Space>
                              ) : (
                                <div>
                                  <Paragraph
                                    style={{
                                      margin: 0,
                                      whiteSpace: "pre-wrap",
                                      color:
                                        msg.type === "user"
                                          ? "white"
                                          : "#1f2937",
                                    }}
                                  >
                                    {msg.content}
                                  </Paragraph>
                                  <Text
                                    style={{
                                      fontSize: "11px",
                                      opacity: 0.7,
                                      color:
                                        msg.type === "user"
                                          ? "white"
                                          : "#6b7280",
                                    }}
                                  >
                                    {formatTime(msg.timestamp)}
                                  </Text>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Sticky bottom composer */}
              <div style={{ position: "sticky", bottom: 16, marginTop: 16 }}>
                {imagePreview && (
                  <div style={{ marginBottom: 8 }}>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        borderRadius: 16,
                        overflow: "hidden",
                        border: "1px solid #e7e5e4",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="preview"
                        style={{ width: 120, height: 120, objectFit: "cover" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          display: "flex",
                          gap: 6,
                        }}
                      >
                        <Button
                          size="small"
                          shape="circle"
                          icon={<EyeOutlined />}
                          onClick={() => setIsImageViewerOpen(true)}
                        />
                        <Button
                          size="small"
                          danger
                          shape="circle"
                          icon={<CloseOutlined />}
                          onClick={clearPickedImage}
                        />
                      </div>
                    </div>

                    <Modal
                      open={isImageViewerOpen}
                      onCancel={() => setIsImageViewerOpen(false)}
                      footer={null}
                      centered
                      width={600}
                      bodyStyle={{ padding: 0, textAlign: "center" }}
                    >
                      <img
                        src={imagePreview}
                        alt="preview-full"
                        style={{ maxWidth: "100%", display: "block" }}
                      />
                    </Modal>
                  </div>
                )}

                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 24,
                    padding: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <TextArea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        imageFile
                          ? "Mô tả thêm về triệu chứng/ảnh của bạn..."
                          : "Hãy hỏi tôi về sức khỏe, chuyên khoa, đặt lịch, y tế..."
                      }
                      autoSize={{ minRows: 1, maxRows: 10 }}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(inputValue);
                        }
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#111827",
                        paddingTop: 4,
                        fontSize: "20px",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      className="!no-scrollbar !mb-2 focus:!outline-none focus:!shadow-none"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload
                          beforeUpload={onPickImage}
                          showUploadList={false}
                          accept="image/*"
                        >
                          <Button
                            shape="circle"
                            className="!size-10 hover:!bg-gray-100"
                            icon={<FiPaperclip size={18} />}
                            title="Tải ảnh lên"
                          />
                        </Upload>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          shape="circle"
                          icon={<ArrowUpOutlined />}
                          onClick={() => handleSendMessage(inputValue)}
                          loading={isLoading}
                          disabled={
                            isLoading || (!inputValue.trim() && !imageFile)
                          }
                          className="!size-10 hover:!bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Content>
      </Layout>
    </>
  );
};

export default AIPage;
