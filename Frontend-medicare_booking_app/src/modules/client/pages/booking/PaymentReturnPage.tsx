import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Typography, Result, Button, Spin, Space, Divider } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { verifyVNPayReturn } from "../../services/client.api";
import { useCurrentApp } from "@/components/contexts/app.context";

const { Title, Paragraph, Text } = Typography;

const PaymentReturnPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const { theme } = useCurrentApp();
  const isDark = theme === "dark";

  // Color palette (khớp với AboutPage)
  const c = {
    bg: isDark ? "#0D1224" : undefined,
    card: isDark ? "#0f1b2d" : "#ffffff",
    subcard: isDark ? "#152238" : "#f8f9fa",
    border: isDark ? "rgba(255,255,255,0.10)" : "#e9ecef",
    text: isDark ? "#e5e7eb" : "#333",
    textMuted: isDark ? "#cbd5e1" : "#666",
    blue: isDark ? "#60a5fa" : "#1890ff",
    green: "#52c41a",
    red: "#ff4d4f",
    successBg: isDark ? "rgba(82,196,26,0.08)" : "#f6ffed",
    successBd: isDark ? "rgba(82,196,26,0.25)" : "#b7eb8f",
    failBg: isDark ? "rgba(255,77,79,0.08)" : "#fff1f0",
    failBd: isDark ? "rgba(255,77,79,0.25)" : "#ffccc7",
    chipBg: isDark ? "rgba(96,165,250,0.10)" : "#f0f8ff",
    chipBd: isDark ? "rgba(96,165,250,0.25)" : "#d6e7ff",
  };

  useEffect(() => {
    // Inject responsive + hover CSS (tự đổi theo dark/light qua biến CSS)
    const responsiveCSS = `
      .payment-card {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        background: var(--card-sub-bg);
        border: 1px solid var(--card-border);
        border-radius: 12px;
        padding: 16px;
      }
      .payment-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .payment-card::before {
        content:'';
        position:absolute; inset:0;
        left:-100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
        transition:left .5s;
      }
      .payment-card:hover::before { left:100%; }

      .copyable-code {
        transition: all 0.2s ease;
        background: var(--chip-bg) !important;
        border: 1px solid var(--chip-bd);
        color: var(--blue);
        border-radius: 8px;
        display:block; padding:8px 12px;
      }
      .copyable-code:hover { transform: scale(1.02); }

      .payment-grid-2-cols {
        display:grid; grid-template-columns: 1fr 1fr; gap:16px;
      }
      @media (max-width: 768px) {
        .payment-grid-2-cols { grid-template-columns: 1fr !important; }
      }
    `;

    const styleId = "payment-return-styles";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    // set CSS variables per theme
    style.textContent = `
      :root {
        --card-bg: ${c.card};
        --card-sub-bg: ${c.subcard};
        --card-border: ${c.border};
        --chip-bg: ${c.chipBg};
        --chip-bd: ${c.chipBd};
        --blue: ${c.blue};
      }
      ${responsiveCSS}
    `;

    const processPaymentReturn = async () => {
      try {
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const vnp_TxnRef = searchParams.get("vnp_TxnRef");
        const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
        const vnp_Amount = searchParams.get("vnp_Amount");
        const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
        const vnp_PayDate = searchParams.get("vnp_PayDate");
        const vnp_BankCode = searchParams.get("vnp_BankCode");
        const vnp_CardType = searchParams.get("vnp_CardType");

        const rawAmount = vnp_Amount ? parseInt(vnp_Amount) : 0;
        const convertedAmount = rawAmount / 100;

        if (!vnp_ResponseCode || !vnp_TxnRef) {
          throw new Error("Thiếu thông tin thanh toán từ VNPay");
        }

        try {
          const response = await verifyVNPayReturn(searchParams.toString() as string);
          const backendResult = await response.data;
          if (backendResult?.success) {
            setPaymentResult({
              success: true,
              txnRef: vnp_TxnRef,
              transactionNo: vnp_TransactionNo,
              amount: convertedAmount,
            });
          }
        } catch {
          // bỏ qua, vẫn hiển thị cho user
        }

        let finalAmount = convertedAmount;
        if (convertedAmount > 10000000) finalAmount = convertedAmount / 100;

        setPaymentResult({
          success: vnp_ResponseCode === "00",
          txnRef: vnp_TxnRef,
          transactionNo: vnp_TransactionNo,
          amount: finalAmount,
          orderInfo: vnp_OrderInfo,
          payDate: vnp_PayDate,
          responseCode: vnp_ResponseCode,
          bankCode: vnp_BankCode,
          cardType: vnp_CardType,
        });
      } catch (error) {
        setPaymentResult({ success: false, error: "Có lỗi xảy ra khi xử lý kết quả thanh toán" });
      } finally {
        setLoading(false);
      }
    };

    processPaymentReturn();
  }, [searchParams, isDark]);

  const formatPayDate = (payDate: string) => {
    if (!payDate) return "";
    const year = payDate.substring(0, 4);
    const month = payDate.substring(4, 6);
    const day = payDate.substring(6, 8);
    const hour = payDate.substring(8, 10);
    const minute = payDate.substring(10, 12);
    const second = payDate.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const getBankName = (bankCode: string) => {
    const bankMap: { [k: string]: string } = {
      NCB: "Ngân hàng NCB",
      AGRIBANK: "Ngân hàng Agribank",
      SCB: "Ngân hàng SCB",
      SACOMBANK: "Ngân hàng Sacombank",
      EXIMBANK: "Ngân hàng Eximbank",
      MSBANK: "Ngân hàng MS Bank",
      NAMABANK: "Ngân hàng Nam A Bank",
      VNMART: "Ví VnMart",
      VIETINBANK: "Ngân hàng Vietinbank",
      VIETCOMBANK: "Ngân hàng Vietcombank",
      HDBANK: "Ngân hàng HDBank",
      DONGABANK: "Ngân hàng Dong A Bank",
      TPBANK: "Ngân hàng TPBank",
      OJB: "Ngân hàng OceanBank",
      BIDV: "Ngân hàng BIDV",
      TECHCOMBANK: "Ngân hàng Techcombank",
      VPBANK: "Ngân hàng VPBank",
      MBBANK: "Ngân hàng MBBank",
      ACB: "Ngân hàng ACB",
      OCB: "Ngân hàng OCB",
      IVB: "Ngân hàng IVB",
      VISA: "Thẻ quốc tế Visa",
    };
    return bankMap[bankCode] || bankCode;
  };

  const getStatusMessage = () => {
    if (paymentResult?.error) return paymentResult.error;
    if (paymentResult?.success) {
      return "Lịch khám của bạn đã được xác nhận và thanh toán thành công. Chúng tôi sẽ gửi thông báo xác nhận qua email/SMS trong thời gian sớm nhất.";
    }
    return "Giao dịch thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ để được giải quyết.";
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: isDark ? c.bg : "linear-gradient(to bottom, #eff6ff, #fff)" }}
      >
        <Card
          style={{
            maxWidth: 520,
            textAlign: "center",
            borderRadius: 16,
            background: c.card,
            border: `1px solid ${c.border}`,
          }}
          bodyStyle={{ padding: 40 }}
        >
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 48, color: c.blue }} />}
            size="large"
          />
          <div style={{ marginTop: 24 }}>
            <Title level={4} style={{ color: c.blue, marginBottom: 8 }}>
              Đang xử lý kết quả thanh toán...
            </Title>
            <Paragraph style={{ fontSize: 16, margin: 0, color: c.textMuted }}>
              Vui lòng chờ trong giây lát
            </Paragraph>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background: isDark
          ? c.bg
          : "linear-gradient(to bottom, rgba(59,130,246,0.08), rgba(255,255,255,1))",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
        {/* Main Result Card */}
        <Card
          style={{
            borderRadius: 16,
            background: c.card,
            border: `1px solid ${c.border}`,
            marginBottom: 24,
          }}
          bodyStyle={{ padding: 32 }}
        >
          <Result
            status={paymentResult?.success ? "success" : "error"}
            title={
              <Title
                level={2}
                style={{
                  color: paymentResult?.success ? c.green : c.red,
                  marginBottom: 12,
                }}
              >
                {paymentResult?.success ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
              </Title>
            }
            subTitle={
              <Paragraph style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.6, margin: 0 }}>
                {getStatusMessage()}
              </Paragraph>
            }
            icon={
              paymentResult?.success ? (
                <CheckCircleOutlined style={{ color: c.green, fontSize: 72 }} />
              ) : (
                <CloseCircleOutlined style={{ color: c.red, fontSize: 72 }} />
              )
            }
            extra={
              <Space size="middle" wrap style={{ justifyContent: "center" }}>
                <Button
                  size="large"
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/")}
                  style={{
                    minWidth: 140,
                    background: isDark ? "#0f172a" : undefined,
                    borderColor: isDark ? c.border : undefined,
                    color: isDark ? c.text : undefined,
                  }}
                >
                  Về trang chủ
                </Button>
                {paymentResult?.success ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    onClick={() => navigate("/my-appointments")}
                    style={{ minWidth: 140 }}
                  >
                    Xem lịch khám
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/booking-options")}
                    style={{ minWidth: 140 }}
                  >
                    Đặt lịch lại
                  </Button>
                )}
              </Space>
            }
          />
        </Card>

        {/* Transaction Details */}
        {paymentResult && !paymentResult.error && (
          <Card
            title={
              <Title level={4} style={{ margin: 0, color: c.blue }}>
                📋 Chi tiết giao dịch
              </Title>
            }
            style={{
              borderRadius: 16,
              background: c.card,
              border: `1px solid ${c.border}`,
              marginBottom: 24,
            }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ display: "grid", gap: 16 }}>
              {/* Row 1 */}
              <div className="payment-grid-2-cols">
                <div className="payment-card">
                  <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 8, fontWeight: 500 }}>
                    🏷️ Mã giao dịch
                  </div>
                  <Text code copyable className="copyable-code">
                    {paymentResult.txnRef}
                  </Text>
                </div>

                {paymentResult.transactionNo && (
                  <div className="payment-card">
                    <div
                      style={{ fontSize: 13, color: c.textMuted, marginBottom: 8, fontWeight: 500 }}
                    >
                      🔢 Mã GD VNPay
                    </div>
                    <Text code copyable className="copyable-code">
                      {paymentResult.transactionNo}
                    </Text>
                  </div>
                )}
              </div>

              {/* Row 2 */}
              <div className="payment-grid-2-cols">
                <div
                  style={{
                    padding: 16,
                    background: isDark ? "rgba(245,34,45,0.08)" : "#fff5f5",
                    borderRadius: 12,
                    border: `2px solid ${isDark ? "rgba(245,34,45,0.25)" : "#ffe7e7"}`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 8, fontWeight: 500 }}>
                    💰 Số tiền
                  </div>
                  <Text strong style={{ color: isDark ? "#ff7875" : "#f5222d", fontSize: 20 }}>
                    {paymentResult.amount?.toLocaleString("vi-VN")} VND
                  </Text>
                </div>

                <div
                  style={{
                    padding: 16,
                    background: paymentResult.success ? c.successBg : c.failBg,
                    borderRadius: 12,
                    border: `2px solid ${paymentResult.success ? c.successBd : c.failBd}`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 8, fontWeight: 500 }}>
                    📊 Trạng thái
                  </div>
                  <Text strong style={{ color: paymentResult.success ? c.green : c.red, fontSize: 16 }}>
                    {paymentResult.success ? "✅ Thành công" : "❌ Thất bại"}
                  </Text>
                </div>
              </div>

              {/* Row 3 */}
              {(paymentResult.bankCode || paymentResult.cardType) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      paymentResult.bankCode && paymentResult.cardType ? "1fr 1fr" : "1fr",
                    gap: 16,
                  }}
                >
                  {paymentResult.bankCode && (
                    <div
                      style={{
                        padding: 16,
                        background: c.subcard,
                        borderRadius: 12,
                        border: `1px solid ${c.border}`,
                      }}
                    >
                      <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 8, fontWeight: 500 }}>
                        🏦 Ngân hàng
                      </div>
                      <Text style={{ fontSize: 15, fontWeight: 600, color: c.blue }}>
                        {getBankName(paymentResult.bankCode)}
                      </Text>
                    </div>
                  )}

                  {paymentResult.cardType && (
                    <div
                      style={{
                        padding: 16,
                        background: c.subcard,
                        borderRadius: 12,
                        border: `1px solid ${c.border}`,
                      }}
                    >
                      <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 8, fontWeight: 500 }}>
                        💳 Loại thẻ
                      </div>
                      <Text style={{ fontSize: 15, fontWeight: 600, color: c.blue }}>
                        {paymentResult.cardType === "ATM" ? "Thẻ ATM nội địa" : paymentResult.cardType}
                      </Text>
                    </div>
                  )}
                </div>
              )}

              {/* Row 4 */}
              {paymentResult.payDate && (
                <div
                  style={{
                    padding: 16,
                    background: c.subcard,
                    borderRadius: 12,
                    border: `1px solid ${c.border}`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 8, fontWeight: 500 }}>
                    🕐 Thời gian thanh toán
                  </div>
                  <Text strong style={{ fontSize: 16, color: c.text }}>
                    {formatPayDate(paymentResult.payDate)}
                  </Text>
                </div>
              )}

              {/* Row 5 */}
              <div className="payment-card" style={{ background: c.subcard }}>
                <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 8, fontWeight: 500 }}>
                  📝 Thông tin đơn hàng
                </div>
                <Text style={{ fontSize: 14, color: c.text }}>
                  {paymentResult.orderInfo || "Thanh toán lịch khám"}
                </Text>
              </div>
            </div>
          </Card>
        )}

        {/* Next Steps */}
        {paymentResult?.success && (
          <Card
            style={{
              background: c.successBg,
              border: `1px solid ${c.successBd}`,
              borderRadius: 16,
              marginBottom: 24,
            }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ textAlign: "center" }}>
              <Title level={4} style={{ color: c.green, marginBottom: 12 }}>
                🎉 Bước tiếp theo
              </Title>
              <Paragraph style={{ fontSize: 15, color: c.textMuted, marginBottom: 20 }}>
                Cảm ơn bạn đã thanh toán! Đây là những gì sẽ xảy ra tiếp theo:
              </Paragraph>

              <div style={{ textAlign: "left", maxWidth: 520, margin: "0 auto" }}>
                {[
                  "Chúng tôi sẽ gửi email/SMS xác nhận trong 5-10 phút",
                  "Phòng khám sẽ liên hệ xác nhận lịch khám trước 1 ngày",
                  "Vui lòng đến đúng giờ và mang theo giấy tờ tùy thân",
                ].map((t, i) => (
                  <div key={i} style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: c.green,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {i + 1}
                    </div>
                    <Text style={{ color: c.text }}>{t}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Support */}
        <Card
          style={{
            background: isDark ? c.subcard : "#fafafa",
            border: `1px solid ${c.border}`,
            borderRadius: 16,
          }}
          bodyStyle={{ padding: 20 }}
        >
          <div style={{ textAlign: "center" }}>
            <Title level={5} style={{ color: c.textMuted, marginBottom: 12 }}>
              💬 Cần hỗ trợ?
            </Title>
            <Space split={<Divider type="vertical" />} wrap>
              <Text strong style={{ color: c.blue }}>Hotline: 1900-1234</Text>
              <Text strong style={{ color: c.blue }}>support@medicare.vn</Text>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 13, color: c.textMuted }}>
                Thời gian hỗ trợ: 8:00 - 20:00 (Thứ 2 - Chủ nhật)
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentReturnPage;
