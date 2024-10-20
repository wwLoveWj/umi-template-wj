import { useControllableValue, useUpdateEffect } from "ahooks";
import type { TableRowSelection } from "antd/lib/table/interface";
import { isFunction, isObject, omit } from "lodash-es";
import { useMemo, useRef, useState } from "react";
import type { WjTableProps } from "../type";

type ExtraProps = WjTableProps & { res: any };

/**
 * 表格选择器
 * selectionButtonsMode: default 普通选择模式
 * selectionButtonsMode: multiple 每个批量操作可独立控制禁用项，默认初始值
 * @param props
 * @returns
 */
function useTableSelection(props: WjTableProps, tableProps: ExtraProps) {
  const { rowSelection: originRowSelection = false } = props;
  const { res, dataSource, rowKey = "id" } = tableProps;

  // multiple 模式下，当前打开的批量操
  const currentOpenSelectionKeyRef = useRef<React.Key>();

  // 选项 keys
  const [selectedRowKeys, setSelectedRowKeys] = useControllableValue(
    originRowSelection === false ? {} : originRowSelection,
    {
      valuePropName: "selectedRowKeys",
      trigger: "onChange",
    }
  );

  // 选项 rows
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // 批量
  const [open, setOpen] = useState(false);

  /**
   * 默认选项 keys
   * @returns
   */
  function getDefaultSelectedRowKeys() {
    if (originRowSelection === false) return [];
    if (isFunction(originRowSelection.defaultSelectedRowKeys)) {
      return (
        originRowSelection.defaultSelectedRowKeys(
          res,
          currentOpenSelectionKeyRef.current
        ) ?? []
      );
    }
    return originRowSelection.defaultSelectedRowKeys ?? [];
  }

  /**
   * 默认选项 rows
   * @returns
   */
  function getDefaultSelectedRows() {
    if (originRowSelection === false) return [];
    const defaultSelectedRowKeys = getDefaultSelectedRowKeys();
    const key = isFunction(rowKey) ? "id" : rowKey;
    return (
      dataSource?.filter((item) =>
        defaultSelectedRowKeys.includes(item[key])
      ) ?? []
    );
  }

  /**
   * multiple模式下，打开批量操作设置初始值
   * @returns
   */
  function updateDefault() {
    if (originRowSelection === false) return;
    setSelectedRowKeys(getDefaultSelectedRowKeys(), getDefaultSelectedRows());
    setSelectedRows(getDefaultSelectedRows());
  }

  /**
   * antd table 的 rowSelection
   */
  const rowSelection: TableRowSelection<any> | undefined = useMemo(() => {
    if (originRowSelection === false) return;
    const selectionButtonsMode =
      originRowSelection.selectionButtonsMode ?? "default";
    if (selectionButtonsMode === "multiple" && open === false) {
      return;
    }

    return {
      selectedRowKeys,
      type: "checkbox",
      fixed: "left",
      preserveSelectedRowKeys: true,
      onChange: (newSelectedRowKeys, newSelectRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(newSelectRows);
        if (isObject(originRowSelection)) {
          originRowSelection?.afterChange?.(newSelectedRowKeys, newSelectRows);
        }
      },
      getCheckboxProps: (record) => {
        return (
          originRowSelection.getCheckboxProps?.(
            record,
            currentOpenSelectionKeyRef.current
          ) ?? {}
        );
      },
      ...(isObject(originRowSelection)
        ? omit(
            originRowSelection,
            "defaultSelectedRowKeys",
            "afterChange",
            "getCheckboxProps"
          )
        : {}),
    };
  }, [originRowSelection, open, selectedRowKeys, setSelectedRowKeys]);

  // 清空选项
  const clearSelected = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  useUpdateEffect(() => {
    updateDefault();
  }, [res]);

  return {
    rowSelection,
    originRowSelection,
    selectedRows,
    selectedRowKeys,
    currentOpenSelectionKeyRef,
    clearSelected,
    updateDefault,
    open,
    setOpen,
    res,
  };
}

export default useTableSelection;
