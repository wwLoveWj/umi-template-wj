import { TableProps } from "antd/lib";
import type { ColumnType } from "antd/es/table";
import { WjFormColumnsPropsType } from "../WjForm";
import type { PaginationProps } from "antd";
import type { NamePath } from "antd/lib/form/interface";
import type useTableSelection from "./hooks/useTableSelection";

export type WjTableColumnType<D = any> = Omit<
  ColumnType<D>,
  "title" | "dataIndex"
> &
  WjFormColumnsPropsType<D> & {
    // 子表格
    columns?: WjTableColumnType<D>[];
    search?: boolean;
    // span?: number;
    dataIndex?: string;
    title?: string;
    width?: number | string;
    // onChange?: (value: any) => void;
    // onSearch?: (value: any) => void;
  };
export type WjTableColumns<D = any> = WjTableColumnType<D>[];

/** 表格 ref 方法 */
export type WjTableRefType = {
  refresh: (params?: Record<string, any>) => Promise<void>;
  search: (params?: Record<string, any>, isNew?: boolean) => Promise<void>;
  reload: (clearSelected?: boolean) => Promise<any>;
  reloadAndRest: (clearSelected?: boolean) => Promise<void>;
  reset: () => Promise<void>;
  clearSelected: () => void;
};

export type WjTableProps<DataType = any, ParamsType = any> = Omit<
  TableProps<DataType>,
  "title" | "columns" | "pagination" | "rowSelection"
> & {
  rowSelection?:
    | false
    | {
        selectedRowKeys: string[];
        onChange: (selectedRowKeys: string[]) => void;
        [propsname: string]: any;
      } extends Record<string, any>
    ? DataType
    : Record<string, any>; //勾选配置
  selectedRowLens?: number; //勾选的个数
  title?: string; //勾选的表格业务名
  request: {
    url?: (
      params?: ParamsType & { current?: number; pageSize: number }
    ) => Promise<any>; //表格的请求接口
    params?: ParamsType; //表格的请求参数
  }; //表格的请求方法
  columns?: WjTableColumns<DataType>; //表格的配置
  /**
   * 自定义左下角选择器按钮
   * @deprecated 已经弃用，改为使用 rowSelection.selectionButtons 或  rowSelection.selectionButtonsRender 实现
   */
  selectionButtonsRender?: (
    selectedRowKeys: React.Key[],
    selectedRows: DataType[]
  ) => React.ReactNode;
  /** 显示/隐藏分页器 */
  pagination?:
    | false
    | (PaginationProps & {
        frontPagination?: boolean;
        pageStartKey?: NamePath;
        afterChange?: (
          page?: number,
          pageSize?: number,
          pageStart?: string,
          pageType?: "prev" | "next"
        ) => void;
      });
  /** 分页类型,  page默认常规分页, cursor游标分页,根据游标进行上下页pageSize偏移 */
  paginationType?: "page" | "cursor";
  dataSource?: DataType[]; //表格的直接配置
  batchOpertions?: Array<{
    label: string; //按钮名称
    onClick: (selectedRowKeys: string[]) => void; //点击事件
    type: "primary" | "default";
  }>;
  noCard?: boolean;
  actionRef?: Ref<WjTableRefType>;
  createBtnOperations?: any[];
  /** 提交查询回调 */
  onSubmit?: () => void;
};

// 游标分页类型
export type MsTableCursorPaginationProps = Omit<PaginationProps, "onChange"> & {
  pageStart?: string;
  pageType?: "prev" | "next";
  dataSource?: any[];
  pageStartKey?: NamePath;
  hasPrev?: boolean;
  hasNext?: boolean;
  onChange?: (
    page?: number,
    pageSize?: number,
    pageStart?: string,
    pageType?: "prev" | "next"
  ) => void;
};
// 多选操作按钮的类型
export type WjTableSelectionProps = ReturnType<typeof useTableSelection> & {
  tableProps: WjTableProps;
};
