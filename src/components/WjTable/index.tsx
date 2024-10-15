import { Alert, Spin, Table, Button, Space } from "antd";
import React, { useImperativeHandle, forwardRef } from "react";
import { useRequest } from "ahooks";
import { WjForm, WjFormColumnsPropsType } from "../WjForm";
import { WjTableProps, WjTableColumns, WjTableColumnType } from "./type";

const Index: React.FC<WjTableProps> = forwardRef(
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
      request?.url
        ? request?.url(request?.params)
        : new Promise((res) => res({ data: null }))
    );
    useImperativeHandle(preantRef, () => {
      return {
        reload: () => run(),
      };
    });
    return (
      <>
        <WjForm
          formConfigList={
            columns?.filter((item) => item?.search) as WjFormColumnsPropsType[]
          }
        />
        <Spin spinning={loading}>
          {hasSelected && (
            <div style={{ marginBottom: 16 }}>
              <Alert
                message={
                  hasSelected ? `选中项 ${selectedRowLens} ${title}` : ""
                }
                type="success"
                showIcon
              />
            </div>
          )}
          <Table
            rowSelection={rowSelection}
            columns={columns}
            pagination={false}
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
                    item?.onClick &&
                    item?.onClick(rowSelection?.selectedRowKeys)
                  }
                >
                  {item?.label}
                </Button>
              ))}
            </Space>
          </div>
        </Spin>
      </>
    );
  }
);

export default Index;
export type { WjTableProps, WjTableColumns, WjTableColumnType };
