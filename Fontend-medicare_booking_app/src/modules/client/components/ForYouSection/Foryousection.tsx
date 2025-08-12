import React from "react";
import { Stethoscope, Heart, Hospital } from "lucide-react";
import "./Foryousection.css";

type ForYouItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  link: string;
};

const forYouItems: ForYouItem[] = [
  {
    id: 1,
    title: "Tìm bác sĩ",
    description:
      "Tra cứu thông tin, đặt lịch hẹn với các chuyên gia y tế hàng đầu.",
    image: "/src/assets/ForYouSection/Doctor-section.jpg",
    icon: <Stethoscope className="text-blue-600 h-8 w-8" />,
    link: "#doctors",
  },
  {
    id: 2,
    title: "Chuyên khoa",
    description:
      "Khám phá các chuyên khoa và tìm kiếm dịch vụ phù hợp với bạn.",
    image: "/src/assets/ForYouSection/Specialty-section.jpg",
    icon: <Heart className="text-sky-600 h-8 w-8" />,
    link: "#specialties",
  },
  {
    id: 3,
    title: "Cơ sở y tế",
    description:
      "Tìm kiếm bệnh viện, phòng khám gần bạn với đánh giá chi tiết.",
    image: "/src/assets/ForYouSection/Clinic-section.jpg",
    icon: <Hospital className="text-indigo-600 h-8 w-8" />,
    link: "#hospitals",
  },
];

const ForYouSection = () => {
  return (
    <div className="py-12 bg-gray-50 font-sans w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Tiêu đề của phần */}
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Dành cho bạn
          </h2>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các dịch vụ chăm sóc sức khỏe nổi bật và phù hợp với nhu
            cầu của bạn.
          </p>
        </div>

        {/* Lưới các thẻ thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {forYouItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Hình ảnh của thẻ */}
              <div className={`relative h-48 md:h-56 overflow-hidden`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 imgForYouSection-${index}`}
                />
              </div>

              {/* Nội dung bên trong thẻ */}
              <div className="p-6 bg-white flex flex-col justify-start items-start h-full">
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-gray-100 p-2 mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForYouSection;
