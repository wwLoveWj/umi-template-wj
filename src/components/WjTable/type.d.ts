import { TableProps } from "antd/lib";
import type { ColumnType } from "antd/es/table";
import { WjFormColumnsPropsType } from "../WjForm";

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
  pagination?: false;
  dataSource?: DataType[]; //表格的直接配置
  batchOpertions?: Array<{
    label: string; //按钮名称
    onClick: (selectedRowKeys: string[]) => void; //点击事件
    type: "primary" | "default";
  }>;
  noCard?: boolean;
  actionRef?: Ref<WjTableRefType>;
  createBtnOperations?: any[];
};
