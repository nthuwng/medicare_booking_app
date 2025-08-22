import { useRef, useState } from "react";
import { Popconfirm, Button, App } from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { getAllSpecialties } from "../../services/admin.api";
import SpecialitesCreate from "./SpecialitesCreate";
import type { ISpecialtyTable } from "@/types";
import SpecialitesDetail from "./SpecialitesDetail";

const SpecialitesTable = () => {
  const actionRef = useRef<ActionType>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<ISpecialtyTable | null>(
    null
  );
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const columns: ProColumns<ISpecialtyTable>[] = [
    {
      title: "Id",
      dataIndex: "id",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <a
            href="#"
            onClick={() => {
              // setDataViewDetail(entity);
              // setOpenViewDetail(true);
            }}
          >
            {entity.id}
          </a>
        );
      },
    },
    {
      title: "Tên chuyên khoa",
      dataIndex: "specialtyName",
      hideInSearch: true,
    },
    {
      title: "Tìm kiếm chuyên khoa",
      dataIndex: "specialtyName",
      hideInTable: true,
      fieldProps: {
        placeholder: "Nhập tên chuyên khoa để tìm kiếm",
        style: {
          width: "280px",
        },
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "iconPath",
      render(dom, entity, index, action, schema) {
        return (
          <img
            src={entity.iconPath}
            alt=""
            className="w-10 h-10 object-cover"
          />
        );
      },
      hideInSearch: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      hideInSearch: true,
      render: (_, record) => (
        <div
          style={{
            maxWidth: 300, // giới hạn chiều rộng
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={record.description} // hover sẽ hiện full text
        >
          {record.description}
        </div>
      ),
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, entity) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px", // khoảng cách đều giữa các icon
            }}
          >
            {/* Xem chi tiết */}
            <EyeOutlined
              style={{
                cursor: "pointer",
                color: "#1890ff",
                fontSize: 16,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#40a9ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1890ff")}
              onClick={() => {
                setDataViewDetail(entity);
                setOpenViewDetail(true);
              }}
            />

            {/* Chỉnh sửa */}
            <EditTwoTone
              twoToneColor="#f57800"
              style={{
                cursor: "pointer",
                fontSize: 16,
              }}
              onClick={() => {}}
            />

            {/* Xóa */}
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa chuyên khoa"}
              description={"Bạn có chắc chắn muốn xóa chuyên khoa này ?"}
              onConfirm={() => {}}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{
                  cursor: "pointer",
                  fontSize: 16,
                }}
              />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<ISpecialtyTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        search={{
          labelWidth: 150,
        }}
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.specialtyName) {
              query += `&specialtyName=${params.specialtyName}`;
            }
          }
          const res = await getAllSpecialties(query);
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
        headerTitle="Danh sách chuyên khoa"
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

      <SpecialitesCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <SpecialitesDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </>
  );
};

export default SpecialitesTable;
