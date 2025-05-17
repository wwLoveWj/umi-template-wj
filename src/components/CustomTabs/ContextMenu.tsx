import React from "react";
import { Menu } from "antd";
import {
  ReloadOutlined,
  CloseOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import styles from "./style.less";

interface ContextMenuProps {
  x: number;
  y: number;
  onRefresh: () => void;
  onCloseOthers: () => void;
  onCloseAll: () => void;
  onClose: () => void;
}

/**
 * 标签页右键菜单组件
 * @param props - 组件属性
 * @returns 右键菜单组件
 */
const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onRefresh,
  onCloseOthers,
  onCloseAll,
  onClose,
}) => {
  return (
    <div
      className={styles.contextMenu}
      style={{
        left: x,
        top: y,
      }}
    >
      <Menu>
        <Menu.Item key="refresh" icon={<ReloadOutlined />} onClick={onRefresh}>
          刷新当前页面
        </Menu.Item>
        <Menu.Item
          key="closeOthers"
          icon={<CloseOutlined />}
          onClick={onCloseOthers}
        >
          关闭其他标签页
        </Menu.Item>
        <Menu.Item
          key="closeAll"
          icon={<CloseCircleOutlined />}
          onClick={onCloseAll}
        >
          关闭所有标签页
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default ContextMenu;
