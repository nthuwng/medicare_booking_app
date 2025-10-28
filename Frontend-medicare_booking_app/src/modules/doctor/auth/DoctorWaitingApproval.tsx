import { useEffect, useState } from "react";
import { getDoctorProfileByUserId } from "../services/doctor.api";
import { useCurrentApp } from "@/components/contexts/app.context";
import type { IDoctorProfile } from "@/types";
import { Button, Empty, Tag, Card, Modal, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

interface IProps {
  children: React.ReactNode;
}

const DoctorWaitingApproval = (props: IProps) => {
  const { user } = useCurrentApp();
  const [doctorWaitingApproval, setDoctorWaitingApproval] =
    useState<IDoctorProfile | null>(null);

  useEffect(() => {
    const fetchDoctorWaitingApproval = async () => {
      const res = await getDoctorProfileByUserId(user?.id as string);
      if (res?.data) {
        setDoctorWaitingApproval(res.data);
      }
    };

    fetchDoctorWaitingApproval();
  }, [user?.id]);

  if (
    doctorWaitingApproval?.approvalStatus === "Pending" ||
    doctorWaitingApproval?.approvalStatus === "Rejected"
  ) {
    return (
      <div className="min-h-[84vh] flex items-center justify-center">
        <Card className="w-full max-w-xl border rounded-xl shadow-sm">
          <div className="p-8 text-center">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
            <Title level={4} className="mt-4 mb-1">
              Hồ sơ đang chờ duyệt
            </Title>
            <Text type="secondary">
              Hồ sơ của bạn có trạng thái:{" "}
              <Tag
                color={
                  doctorWaitingApproval?.approvalStatus === "Rejected"
                    ? "red"
                    : "gold"
                }
              >
                {doctorWaitingApproval?.approvalStatus}
              </Tag>
            </Text>
            {doctorWaitingApproval?.approvalStatus === "Rejected" && (
              <div className="mt-4">
                <Text type="secondary">
                  Vui lòng cập nhật lại thông tin và gửi yêu cầu duyệt.
                </Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return <>{props.children}</>;
};

export default DoctorWaitingApproval;
