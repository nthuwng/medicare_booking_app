import React, { useState } from "react";
import { ArrowRight, Plus, Building2, Stethoscope } from "lucide-react";

// Define the type for FAQ items
interface FAQItem {
  id: number;
  question: string;
}

const BannerHomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [showFAQ, setShowFAQ] = useState(false);

  const faqItems: FAQItem[] = [
    { id: 1, question: "Ung thư tuyến tiền liệt khám ở khoa nào?" },
    { id: 2, question: "U bướu da khám ở đâu?" },
    { id: 3, question: "Gân bị rách khám khoa nào?" },
    { id: 4, question: "Xương bị gãy khám ở đâu?" },
    { id: 5, question: "Đăng ký trực tiếp tại Bệnh viện Quốc tế City" },
    { id: 6, question: "Số Zalo Booking Care" },
    { id: 7, question: "Tái khám với bác sĩ" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle AI chat submission here
    console.log("AI Chat submitted:", inputValue);
  };

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  return (
    <div className="min-h-[70vh] bg-blue-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 max-w-4xl">
        Hỏi nhanh, đáp chuẩn - Đặt khám dễ dàng
      </h1>

      {/* AI Chat Interface */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
        {/* Input Section */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center bg-gray-50 rounded-xl p-4 border-2 border-gray-200 focus-within:border-blue-400 transition-colors">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi Trợ lý AI cách đặt lịch khám"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
            <button
              type="submit"
              className="ml-3 p-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </form>

        {/* Quick Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border-2 border-blue-200 transition-colors">
            <Building2 className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-blue-800 font-medium">
              Chọn bệnh viện/phòng khám
            </span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl border-2 border-green-200 transition-colors">
            <Stethoscope className="h-6 w-6 text-green-600 mr-3" />
            <span className="text-green-800 font-medium">
              Khám chuyên khoa/bác sĩ
            </span>
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-4xl">
        <button
          onClick={toggleFAQ}
          className="flex items-center justify-between w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 mb-4"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Câu hỏi thường gặp
          </h2>
          <Plus
            className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
              showFAQ ? "rotate-45" : "rotate-0"
            }`}
          />
        </button>

        {showFAQ && (
          <div className="space-y-3 animate-fadeIn">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
              >
                <span className="text-gray-700 flex-1">{item.question}</span>
                <Plus className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerHomePage;
