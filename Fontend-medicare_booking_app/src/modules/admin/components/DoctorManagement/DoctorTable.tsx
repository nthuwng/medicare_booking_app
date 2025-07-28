import { useRef, useState } from "react";
import { Popconfirm, Button, App, Tag, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  getAllAdminsProfile,
  getAllDoctorsProfile,
  getAllUsers,
} from "../../services/admin.api";
import type { IAdminProfile, IDoctorProfile, IManageUser } from "../../types";
import DoctorDetail from "./DoctorDetail";

const DoctorTable = () => {
  const actionRef = useRef<ActionType>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IDoctorProfile | null>(
    null
  );
  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const columns: ProColumns<IDoctorProfile>[] = [
    {
      title: "Id",
      dataIndex: "id",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <a
            href="#"
            onClick={() => {
              setDataViewDetail(entity);
              setOpenViewDetail(true);
            }}
          >
            {entity.id}
          </a>
        );
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: "Tên",
      dataIndex: "fullName",
      ellipsis: true,
      width: 200,
      fieldProps: {
        placeholder: "Nhập tên để tìm kiếm",
        style: {
          width: "180px",
        },
      },
    },
    {
      title: "Chức vụ",
      dataIndex: "title",
      valueType: "select",
      valueEnum: {
        BS: { text: "Bác sĩ" },
        ThS: { text: "Thạc sĩ" },
        TS: { text: "Tiến sĩ" },
        PGS: { text: "Phó Giáo sư" },
        GS: { text: "Giáo sư" },
      },
      render(dom, entity) {
        return entity.title === "BS" ? (
          <Tag color="blue">Bác sĩ</Tag>
        ) : entity.title === "ThS" ? (
          <Tag color="green">Thạc sĩ</Tag>
        ) : entity.title === "TS" ? (
          <Tag color="purple">Tiến sĩ</Tag>
        ) : entity.title === "PGS" ? (
          <Tag color="orange">Phó Giáo Sư</Tag>
        ) : (
          <Tag color="red">Giáo Sư</Tag>
        );
      },
      fieldProps: {
        placeholder: "Chọn chức vụ",
        style: { width: "150px" },
      },
    },
    {
      title: "Số điện thoại:",
      dataIndex: "phone",
      fieldProps: {
        placeholder: "Nhập số điện thoại để tìm kiếm",
        style: {
          width: "240px",
        },
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return entity.gender === "Male" ? (
          <Tag color="blue">Nam</Tag>
        ) : (
          <Tag color="pink">Nữ</Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "approvalStatus",
      hideInSearch: true,
    },
    {
      title: "Action",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EyeOutlined
              style={{
                cursor: "pointer",
                marginRight: 10,
                color: "#1890ff",
                fontSize: 15,
              }}
              onClick={() => {
                setDataViewDetail(entity);
                setOpenViewDetail(true);
              }}
            />
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", marginRight: 10, fontSize: 15 }}
              onClick={() => {}}
            />

            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa chuyên khoa"}
              description={"Bạn có chắc chắn muốn xóa chuyên khoa này ?"}
              onConfirm={() => {}}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone
                  twoToneColor="#ff4d4f"
                  style={{ fontSize: 15 }}
                />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<IDoctorProfile>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        search={{
          labelWidth: 0,
          span: 6,
          collapsed: false,
          collapseRender: false,
        }}
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            query += `page=${params.current}&pageSize=${params.pageSize}`;
            if (params.fullName) {
              query += `&fullName=${params.fullName}`;
            }
            if (params.phone) {
              query += `&phone=${params.phone}`;
            }
            if (params.title) {
              query += `&title=${params.title}`;
            }
          }
          const res = await getAllDoctorsProfile(query);
          if (res.data) {
            setMeta(res.data.meta);
          }
          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        headerTitle="Danh sách thông tin admin"
        toolBarRender={() => [
          <Button icon={<ExportOutlined />} type="primary">
            Export
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />

      <DoctorDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      {/* <SpecialitesCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      /> */}
    </>
  );
};

export default DoctorTable;
