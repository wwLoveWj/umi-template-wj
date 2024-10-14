import React, { useState, useEffect } from "react";
import { Space, Button, Table } from "antd";
import type { TableColumnsType } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { history, useLocation } from "umi";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import {
  ArticleInfoListQueryAPI,
  ArticleInfoDelAPI,
} from "@/service/api/article";
import DelPopconfirm from "@/components/DelPopconfirm";
import type { ArticleTableDataType } from "./type.d.ts";

const Index: React.FC = () => {
  // const [tableData, setTableData] = useState<ArticleTableDataType[]>([]); //文章信息表格
  // const detailsHistory = useLocation();
  // 查询列表信息
  const { data: tableData, run, loading } = useRequest(ArticleInfoListQueryAPI);
  //   删除文章列表数据接口
  const DelArticleAPIRun = useRequest(ArticleInfoDelAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      run({});
    },
  });

  // 列表项配置
  const columns: TableColumnsType<ArticleTableDataType> = [
    {
      title: "标题",
      dataIndex: "title",
      width: 180,
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
    <div className="layout-padding-white">
      <div style={{ marginBottom: 16 }}>
        <Space size="small">
          <Button
            type="primary"
            onClick={() => {
              history.push({ pathname: "/article/create" }, { editorId: "" });
            }}
          >
            写文章
          </Button>
          <Button type="primary" icon={<SearchOutlined />} onClick={run}>
            查询
          </Button>
        </Space>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        rowKey="editorId"
        // sticky
        // scroll={{ y: "max-content" }}
        size="small"
      />
    </div>
  );
};

export default Index;
