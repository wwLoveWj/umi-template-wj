import { Alert, Spin, Table, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useImperativeHandle, forwardRef } from "react";
import { useRequest } from "ahooks";
import { TableProps } from "antd/lib";

type Iprops<T = any> = TableProps<T> & {
  rowSelection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[]) => void;
    [propsname: string]: any;
  } extends Record<string, any>
    ? T
    : Record<string, any>; //勾选配置
  selectedRowLens?: number; //勾选的个数
  title?: string; //勾选的表格业务名
  request: {
    url: any; //表格的请求接口
    params: Record<string, any>; //表格的请求参数
  }; //表格的请求方法
  columns: ColumnsType<T>; //表格的配置
  dataSource?: T[]; //表格的直接配置
  batchOpertions?: Array<{
    label: string; //按钮名称
    onClick: (selectedRowKeys: string[]) => void; //点击事件
    type: "primary" | "default";
  }>;
};
const Index: React.FC<Iprops> = forwardRef(
  (
    {
      rowSelection,
      selectedRowLens = 0,
      title,
      request,
      columns,
      dataSource,
      batchOpertions,
      ...tableParams
    },
    preantRef
  ) => {
    const hasSelected = selectedRowLens > 0;
    // 表格的请求方法
    const { data, run, loading } = useRequest(() =>
      request?.url(request?.params)
    );

    useImperativeHandle(preantRef, () => {
      return {
        reload: () => run(),
      };
    });
    return (
      <Spin spinning={loading}>
        {hasSelected && (
          <div style={{ marginBottom: 16 }}>
            <Alert
              message={hasSelected ? `选中项 ${selectedRowLens} ${title}` : ""}
              type="success"
              showIcon
            />
          </div>
        )}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={
            dataSource && Array.isArray(dataSource)
              ? dataSource
              : (data as []) || []
          }
          {...tableParams}
        />
        <div>
          <Space>
            {(batchOpertions || [])?.map((item) => (
              <Button
                type={item?.type}
                onClick={() =>
                  item?.onClick && item?.onClick(rowSelection?.selectedRowKeys)
                }
              >
                {item?.label}
              </Button>
            ))}
          </Space>
        </div>
      </Spin>
    );
  }
);

export default Index;
