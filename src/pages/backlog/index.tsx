import React from "react";
import { WjForm } from "@/components/WjForm";
import { history } from "umi";
import WjTable, { WjTableColumns } from "@/components/WjTable";
import { MailInfoQueryAPI } from "@/service/api/mail";
import { storage } from "@/utils/storage";
export default function Index() {
  // 当前用户邮箱
  const currentEmail = storage.get("login-info")?.email || "";
  const columns: WjTableColumns = [
    {
      dataIndex: "task",
      title: "主题",
    },
    {
      dataIndex: "description",
      title: "通知内容",
    },
    {
      dataIndex: "sendEmail",
      title: "通知人邮箱",
    },
    {
      valueType: "date",
      dataIndex: "reminderTime",
      title: "通知时间",
    },
    {
      valueType: "select",
      dataIndex: "status",
      search: true,
      title: "状态",
      fieldProps: {
        options: [
          {
            label: "已通知",
            value: "1",
          },
          {
            label: "待通知",
            value: "2",
          },
        ],
        placeholder: "请选择状态",
      },
    },
  ];

  return (
    <WjTable
      columns={columns}
      scroll={{ y: "auto-content" }}
      request={{ url: MailInfoQueryAPI, params: { currentEmail } }}
      rowKey="editorId"
      // batchOpertions={[{ label: "批量上传" }]}
    />
  );
}
