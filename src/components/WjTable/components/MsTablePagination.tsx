import type { WjTableProps, MsTableCursorPaginationProps } from "../type";
import { Pagination } from "antd";
import MsTableCursorPagination from "./MsTableCursorPagination";

type MsTablePaginationProps = MsTableCursorPaginationProps & {
  tableProps: WjTableProps;
};

function MsTablePagination(props: MsTablePaginationProps) {
  const { tableProps, ...paginationProps } = props;
  const { paginationType = "page", pagination = {} } = tableProps;

  if (pagination === false) return <></>;

  /* 普通分页器 */
  if (paginationType === "page") {
    return (
      <Pagination
        size="small"
        showSizeChanger
        showTotal={(value) => `共 ${value} 项`}
        {...paginationProps}
        total={pagination?.total}
      />
    );
  }

  /* 游标分页器 */
  if (paginationType === "cursor") {
    return <MsTableCursorPagination {...paginationProps} />;
  }

  return <></>;
}

export default MsTablePagination;
