import React from "react";
import { WjForm } from "@/components/WjForm";
import { history } from "umi";
import WjTable, { WjTableColumns } from "@/components/WjTable";
import {
  ArticleInfoListQueryAPI,
  ArticleInfoDelAPI,
} from "@/service/api/article";
export default function Index() {
  const columns: WjTableColumns = [
    {
      dataIndex: "taskName",
      title: "待办事项",
    },
    {
      dataIndex: "email",
      title: "通知人邮箱",
    },
    {
      valueType: "date",
      dataIndex: "notifyTime",
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
    {
      dataIndex: "description",
      title: "描述",
    },
  ];

  return (
    <WjTable
      columns={columns}
      scroll={{ y: "auto-content" }}
      request={{ url: ArticleInfoListQueryAPI, params: {} }}
      rowKey="editorId"
      // batchOpertions={[{ label: "批量上传" }]}
    />
  );
}
