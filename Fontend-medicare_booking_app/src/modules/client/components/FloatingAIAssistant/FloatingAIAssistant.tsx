import React, { useState } from "react";
import { Button, Tooltip, Badge } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import aiIcon from "@/assets/images/ai.png";

const FloatingAIAssistant = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ai");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "10px",
        zIndex: 1000,
      }}
    >
      <Tooltip
        title="Trợ lý AI MediCare - Hỏi về sức khỏe, đặt lịch, tìm bác sĩ"
        placement="left"
        color="linear-gradient(135deg, #a855f7 0%, #6366f1 100%)"
      >
        <Badge
          count="AI"
          style={{
            backgroundColor: "#52c41a",
            fontSize: "12px",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
          offset={[-5, 5]}
        >
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={
              <img
                src={aiIcon}
                alt="AI Assistant"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            }
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: "55px",
              height: "55px",
              background: isHovered
                ? "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" // Cyan to blue
                : "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)", // Purple to indigo
              border: "none",
              boxShadow: isHovered
                ? "0 8px 25px rgba(6, 182, 212, 0.4), 0 0 0 4px rgba(6, 182, 212, 0.1)"
                : "0 4px 15px rgba(168, 85, 247, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px", // Thêm padding để hình ảnh không bị sát viền
              overflow: "hidden",
            }}
          />
        </Badge>
      </Tooltip>

      {/* Floating text animation */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            bottom: "0",
            right: "80px", // Đổi từ left sang right để text hiển thị bên trái nút
            background: "rgba(255, 255, 255, 0.95)",
            color: "#1f2937",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "500",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <MessageOutlined style={{ marginRight: "6px", color: "#a855f7" }} />
          Trợ lý AI
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3), 0 0 0 8px rgba(102, 126, 234, 0.1);
          }
          100% {
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
        }

        /* Pulse animation for attention */
        .ai-button-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingAIAssistant;
