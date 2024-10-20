import { Col, Row } from "antd";
import MsTablePagination from "./MsTablePagination";
import { useState, useRef } from "react";
import type { WjTableProps } from "../type";

type WjTableFooterRenderProps = WjTableProps & { tableProps: WjTableProps } & {
  queryState: any;
  data: any;
  query: any;
  request: any;
  handlePaginationChange: any;
  selectionButtonsRender: any;
  footer: any;
  // tableSelectionProps: any;
  // tableFooterAreaRef: any;
};
const TABLE_SPACE = 16;
/**
 * 表格 footer
 */
export default function TableFooterRender({
  tableProps,
  queryState,
  data,
  // props,
  query,
  request,
  handlePaginationChange,
  selectionButtonsRender,
  footer,
  pagination,
}: // tableSelectionProps,
// tableFooterAreaRef,
WjTableFooterRenderProps) {
  const tableFooterAreaRef = useRef<HTMLDivElement>(null);
  if (footer) {
    return (
      <Row
        ref={tableFooterAreaRef}
        justify="space-between"
        align="middle"
        style={{ marginTop: TABLE_SPACE }}
      >
        {footer(data)}
      </Row>
    );
  }

  if (queryState.total === 0) return null;

  const showPagination = Boolean(pagination) && request;
  if (!footer && !selectionButtonsRender && !showPagination) return null;
  // TODO:分页器
  return (
    <Row
      ref={tableFooterAreaRef}
      justify="space-between"
      align="middle"
      style={{ marginTop: TABLE_SPACE }}
    >
      <Col>
        {/* 多选操作按钮 */}
        {/* <MsTableSelection {...tableSelectionProps} tableProps={tableProps} /> */}
      </Col>
      <Col>
        {/* 分页器 */}
        <MsTablePagination
          {...pagination}
          onChange={handlePaginationChange}
          dataSource={data}
          current={query.current}
          pageStart={query.pageStart}
          pageType={query.pageType}
          pageSize={query.pageSize}
          total={queryState.total}
          hasNext={queryState.hasNext}
          hasPrev={queryState.hasPrev}
          tableProps={{ ...tableProps, pagination }}
        />
      </Col>
    </Row>
  );
}
