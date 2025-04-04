import React, { useState, useEffect, useRef } from "react";
import { Space, Button } from "antd";
import { history, useLocation } from "umi";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import {
  ArticleInfoListQueryAPI,
  ArticleInfoDelAPI,
} from "@/service/api/article";
import DelPopconfirm from "@/components/DelPopconfirm";
import type { ArticleTableDataType } from "./type.d.ts";
import WjTable, { WjTableColumns, WjTableRefType } from "@/components/WjTable";

const Index: React.FC = () => {
  const actionRef = useRef<WjTableRefType>(null);
  // const detailsHistory = useLocation();

  //   删除文章列表数据接口
  const DelArticleAPIRun = useRequest(ArticleInfoDelAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      // 查询列表信息;
      actionRef?.current?.reload();
    },
  });

  // 列表项配置
  const columns: WjTableColumns = [
    {
      title: "标题",
      dataIndex: "title",
      width: 180,
      valueType: "input",
      search: true,
    },
    {
      title: "文章内容",
      dataIndex: "editorContent",
      render: (_, { editorContent }) => {
        return <p dangerouslySetInnerHTML={{ __html: editorContent }}></p>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 210,
      render: (_, { createTime }) => {
        return createTime
          ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
          : "-";
      },
    },
    {
      title: "操作",
      key: "action",
      sorter: true,
      width: 120,
      render: (record: ArticleTableDataType) => (
        <Space size="middle">
          <a
            onClick={() => {
              history.push(
                { pathname: "/article/edit" },
                { editorId: record?.editorId }
              );
            }}
          >
            编辑
          </a>
          <DelPopconfirm
            onConfirm={() => {
              DelArticleAPIRun.run({ editorId: record?.editorId });
            }}
            title={`确定要删除【${record?.title}】的文章信息吗?`}
          />
          {/* <a
            onClick={() => {
              history.push(
                {
                  pathname: "/user-integral/integral-details",
                },
                { ...record }
              );
            }}
          >
            详情
          </a> */}
        </Space>
      ),
    },
  ];
  return (
    <div>
      <WjTable
        actionRef={actionRef}
        columns={columns}
        request={{ url: ArticleInfoListQueryAPI, params: {} }}
        rowKey="editorId"
        size="small"
        noCard={true}
        createBtnOperations={[
          <Button
            type="primary"
            onClick={() => {
              history.push({ pathname: "/article/create" }, { editorId: "" });
            }}
          >
            写文章
          </Button>,
          // <Button type="primary" icon={<SearchOutlined />} onClick={run}>
          //   查询
          // </Button>,
        ]}
        // sticky
        // scroll={{ y: "max-content" }}
        // batchOpertions={[{ label: "批量上传" }]}
      />
    </div>
  );
};

export default Index;
