import { Alert, Spin, Table, Button, Space } from "antd";
import React, { useImperativeHandle, forwardRef } from "react";
import { useRequest } from "ahooks";
import { WjForm, WjFormColumnsPropsType } from "../WjForm";
import { WjTableProps, WjTableColumns, WjTableColumnType } from "./type";
import styles from "./style.less";

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
      noCard,
      actionRef,
      ...restProps
    },
    ref
  ) => {
    const hasSelected = selectedRowLens > 0;
    // 表格的请求方法
    const { data, run, loading } = useRequest(() =>
      request?.url
        ? request?.url(request?.params)
        : new Promise((res) => res({ data: null }))
    );
    useImperativeHandle(actionRef, () => {
      return {
        reload: () => run(),
      };
    });
    return (
      <>
        <div style={{ marginBottom: 12 }}>
          <WjForm formConfigList={columns as WjFormColumnsPropsType[]} />
        </div>
        <div className={styles.tableLayout}>
          <Spin spinning={loading}>
            <div className={styles.tableOperations}>
              <Button type="primary" style={{ marginRight: 12 }}>
                创建按钮
              </Button>
              <Alert
                message={
                  hasSelected ? `选中项 ${selectedRowLens} ${title}` : ""
                }
                type="success"
                showIcon
                style={{ width: 200 }}
              />
            </div>
            <Table
              {...restProps}
              // ref={ref}
              rowSelection={rowSelection}
              columns={columns}
              pagination={false}
              scroll={{ y: "auto-content" }}
              dataSource={
                dataSource && Array.isArray(dataSource)
                  ? dataSource
                  : (data as []) || []
              }
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
        </div>
      </>
    );
  }
);

export default Index;
export type { WjTableProps, WjTableColumns, WjTableColumnType };
