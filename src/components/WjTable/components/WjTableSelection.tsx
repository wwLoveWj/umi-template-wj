import type { ItemsProps } from "magical-antd-ui";
import { Button, Space } from "antd";
import { isBoolean, isFunction, isNil } from "lodash-es";
import { WjActions } from "magical-antd-ui";
import type { WjTableSelectionProps } from "../type";

function WjTableSelection(props: WjTableSelectionProps) {
  const {
    originRowSelection: rowSelection,
    selectedRows,
    selectedRowKeys,
    updateDefault,
    clearSelected,
    open,
    setOpen,
    currentOpenSelectionKeyRef,
    tableProps = {},
  } = props;

  if (rowSelection === false || isNil(rowSelection)) return <></>;

  const selectionButtonsRender =
    tableProps.selectionButtonsRender ?? rowSelection.selectionButtonsRender;

  if (isFunction(selectionButtonsRender)) {
    return (
      <Space>
        {rowSelection?.type === "checkbox" && (
          <div>
            选中 <span>{selectedRowKeys?.length}</span> 项
          </div>
        )}
        {selectionButtonsRender?.(selectedRowKeys, selectedRows)}
      </Space>
    );
  }

  // 自定义配置
  const selectionButtons = rowSelection?.selectionButtons;

  if (isFunction(selectionButtons)) {
    const actionProps = selectionButtons?.(selectedRowKeys, selectedRows);

    const items = actionProps.items?.map((item, index) => {
      if (isBoolean(item)) return item;
      const key = item.key ?? index;
      return {
        ...item,
        onClick() {
          currentOpenSelectionKeyRef.current = key;
          updateDefault();
          setOpen(true);
        },
      };
    });

    const currentItem = actionProps.items?.find((item, index) => {
      if (isBoolean(item)) return false;
      return (
        currentOpenSelectionKeyRef.current === item.key ||
        currentOpenSelectionKeyRef.current === index
      );
    }) as ItemsProps;

    if (open) {
      return (
        <Space>
          {rowSelection?.type === "checkbox" && (
            <div>
              {currentItem?.label}选中 <span>{selectedRowKeys.length}</span> 项
            </div>
          )}
          <Button
            onClick={() => {
              currentItem?.onClick?.();
              setOpen(false);
              currentOpenSelectionKeyRef.current = undefined;
              clearSelected();
            }}
            disabled={selectedRowKeys.length === 0}
          >
            确认
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              currentOpenSelectionKeyRef.current = undefined;
              clearSelected();
            }}
          >
            取消
          </Button>
        </Space>
      );
    }

    return <WjActions {...actionProps} items={items} actionsType="button" />;
  }

  return <></>;
}

export default WjTableSelection;
