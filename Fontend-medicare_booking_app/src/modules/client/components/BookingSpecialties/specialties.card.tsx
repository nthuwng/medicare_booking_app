import React from "react";
import { Card, Avatar, Row, Col, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ISpecialtyBooking } from "../../types";

const { Title, Text } = Typography;

type SpecialtiesCardProps = {
  dataSpecialties: ISpecialtyBooking[];
  setDataSpecialties: (specialties: ISpecialtyBooking[]) => void;
  searchText?: string;
};

const SpecialtiesCard = (props: SpecialtiesCardProps) => {
  const { dataSpecialties } = props;
  const navigate = useNavigate();

  const handleViewDoctors = (specialty: ISpecialtyBooking) => {
    navigate(
      `/booking/doctor?specialtyId=${
        specialty.id
      }&specialtyName=${encodeURIComponent(specialty.specialtyName)}`
    );
  };

  return (
    <>
      {dataSpecialties.length > 0 && (
        <Row gutter={[24, 24]}>
          {dataSpecialties.map((specialty) => (
            <Col key={specialty.id} xs={24} md={12}>
              <Card
                className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm cursor-pointer"
                onClick={() => handleViewDoctors(specialty)}
                bodyStyle={{ padding: "20px" }}
              >
                <div className="flex items-center gap-5">
                  <Avatar
                    size={104}
                    src={specialty.iconPath || undefined}
                    style={{
                      backgroundImage: !specialty.iconPath
                        ? "linear-gradient(135deg, #1890ff, #096dd9)"
                        : undefined,
                      color: "#fff",
                      fontSize: "42px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid #ffffff",
                      boxShadow: "0 6px 20px rgba(24, 144, 255, 0.25)",
                    }}
                  >
                    {!specialty.iconPath &&
                      specialty.specialtyName?.charAt(0).toUpperCase()}
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <Title level={4} className="!mb-1 !text-gray-800">
                      {specialty.specialtyName}
                    </Title>
                    <Text className="text-gray-500">
                      Xem bác sĩ theo chuyên khoa
                    </Text>
                  </div>

                  <RightOutlined className="text-gray-400" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default SpecialtiesCard;
