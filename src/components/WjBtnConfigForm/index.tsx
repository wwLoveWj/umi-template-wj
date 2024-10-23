import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Form, Row, Skeleton, Space } from "antd";
import { DownOutlined, UpOutlined, SearchOutlined } from "@ant-design/icons";
import useResponsiveSize from "../hooks/useResponsiveSize";
import { WjFormColumnsPropsType } from "../WjForm/type";
import type { FormInstance } from "antd";

export default forwardRef(function Index({
  loading,
  submitter,
  defaultCollapsed,
  column,
  tableSearchColumns,
  onSubmit,
  onReset,
  form,
  btnFormRef,
  onChgCollapsed,
}: {
  loading: boolean;
  column?: number;
  defaultCollapsed?: boolean;
  tableSearchColumns: WjFormColumnsPropsType[];
  form: FormInstance;
  submitter?: {
    submitText?: string;
    resetText?: string;
    resetBtnProps?: any;
    submitBtnProps?: any;
  };
  btnFormRef: any;
  onChgCollapsed: (param: boolean) => void; //传递给父级判断是否已经收起展开
  onSubmit?: () => void; //提交操作之外的处理
  onReset?: () => void; //重置取消事件之外的其他操作
}) {
  // 响应式列数量
  const columnNumber = useResponsiveSize(column);

  // 是否折叠
  const [collapsed, setCollapsed] = useState(defaultCollapsed ?? true);

  // 显示折叠按钮
  const showCollapsed =
    tableSearchColumns && tableSearchColumns?.length > columnNumber - 1;

  const handleCollapsed = () => {
    setCollapsed((prev) => !prev);
    onChgCollapsed(!collapsed);
  };
  const handleSubmit = () => {
    form.submit();
    onSubmit?.();
  };

  const handleRest = () => {
    form.resetFields();
    (onReset as any)?.();
  };

  useImperativeHandle(btnFormRef, () => ({
    collapsed,
  }));
  return (
    <Row justify="end">
      <Space>
        {loading ? (
          <>
            <Skeleton.Button active />
            <Skeleton.Button active />
          </>
        ) : (
          <>
            {/* 查询按钮 */}
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              // icon={<SearchOutlined />}
              {...submitter?.submitBtnProps}
            >
              {submitter?.submitText ?? "查询"}
            </Button>
            {/* 重置按钮 */}
            <Button
              disabled={loading}
              onClick={handleRest}
              {...submitter?.resetBtnProps}
            >
              {submitter?.resetText ?? "重置"}
            </Button>
            {/* 折叠按钮 */}
            {showCollapsed && (
              <Button type="link" onClick={handleCollapsed}>
                {collapsed ? "展开" : "收起"}
                {collapsed ? <DownOutlined /> : <UpOutlined />}
              </Button>
            )}
          </>
        )}
      </Space>
    </Row>
  );
});
