import type { IClinicTable } from "../../types";
import { Drawer, Descriptions } from "antd";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IClinicTable | null;
  setDataViewDetail: (v: IClinicTable | null) => void;
}

const ClinicDetail = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  return (
    <Drawer
      title="Chức năng xem chi tiết"
      width={"40vw"}
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin phòng khám" bordered column={1}>
        <Descriptions.Item label="Id" >{dataViewDetail?.id}</Descriptions.Item>
        <Descriptions.Item label="Tên hiển thị">
          {dataViewDetail?.clinicName}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {dataViewDetail?.street}, {dataViewDetail?.district},
          {dataViewDetail?.city}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {dataViewDetail?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          {dataViewDetail?.description}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default ClinicDetail;
