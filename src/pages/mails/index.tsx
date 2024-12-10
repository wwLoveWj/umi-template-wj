import React, { useState } from "react";
import { Button, Space } from "antd";
import { MsModal } from "magical-antd-ui";
import Setting from "./settings";
import {
  MailConfigCreateAPI,
  MailConfigInfoQueryAPI,
  MailConfigInfoSetAPI,
} from "@/service/api/mail";
import { useRequest } from "ahooks";
import WjTable, { WjTableColumns } from "@/components/WjTable";
import DelPopconfirm from "@/components/DelPopconfirm";
import { storage } from "@/utils/storage";

const STATUS = [
  {
    label: "停用",
    value: 0,
  },
  {
    label: "启用",
    value: 1,
  },
];
export default function MailIndex() {
  // 选中的当前配置
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([
    "TASK_TIMING_REMINDER",
  ]);
  const createMailConfig = useRequest(MailConfigCreateAPI, {
    manual: true,
  });

  // 当前用户邮箱
  const currentEmail = storage.get("login-info")?.email || "";
  const columns: WjTableColumns = [
    {
      dataIndex: "configName",
      title: "配置名称",
    },
    {
      dataIndex: "configKey",
      title: "configKey",
    },
    {
      dataIndex: "description",
      title: "备注",
    },
    {
      dataIndex: "updateTime",
      title: "更新时间",
    },
    {
      valueType: "select",
      dataIndex: "status",
      search: true,
      title: "状态",
      render: (value) => STATUS?.find((item) => item.value === value)?.label,
      fieldProps: {
        options: STATUS,
        placeholder: "请选择状态",
      },
    },
    {
      title: "操作",
      key: "action",
      sorter: true,
      width: 210,
      render: (record: any) => (
        <Space size="middle">
          {record?.status === 1 ? (
            <a onClick={() => {}}>停用</a>
          ) : (
            <a onClick={() => {}}>启用</a>
          )}
          <a onClick={() => {}}>编辑</a>
          <DelPopconfirm
            onConfirm={() => {
              // ExcelInfoDelAPIRun.run({ backlogId: record?.backlogId });
            }}
            title={`确定要删除【${record?.configName}】配置吗?`}
          />
        </Space>
      ),
    },
  ];

  useRequest(() => MailConfigInfoSetAPI({ configKey: selectedRowKeys[0] }), {
    refreshDeps: [selectedRowKeys],
  });
  return (
    <WjTable
      columns={columns}
      scroll={{ y: "auto-content" }}
      request={{ url: MailConfigInfoQueryAPI, params: { currentEmail } }}
      rowKey="configKey"
      createBtnOperations={[
        <Button
          onClick={() =>
            MsModal.open(Setting).then((res: any) => {
              createMailConfig.run(res);
            })
          }
        >
          邮箱配置
        </Button>,
      ]}
      onRow={(record) => ({
        onClick: () => setSelectedRowKeys([record?.configKey]),
      })}
      rowSelection={{
        defaultSelectedRowKeys: selectedRowKeys,
        selectedRowKeys,
        type: "radio",
        onChange: (selectedRowKey: React.Key[]) => {
          setSelectedRowKeys(selectedRowKey);
        },
      }}
    />
  );
}
