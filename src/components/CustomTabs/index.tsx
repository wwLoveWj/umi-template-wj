import React, { useState, useEffect, useCallback } from "react";
import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { KeepAlive } from "react-activation";
import ContextMenu from "./ContextMenu";
import styles from "./style.less";

interface TabItem {
  key: string;
  title: string;
  path: string;
  closable: boolean;
}

/**
 * 自定义 Tabs 组件
 * @returns 自定义 Tabs 组件
 */
const CustomTabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      key: "home",
      title: "首页",
      path: "/",
      closable: false,
    },
  ]);
  const [activeKey, setActiveKey] = useState("home");
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetKey: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    targetKey: "",
  });

  // 根据路由更新标签页
  useEffect(() => {
    const path = location.pathname;
    const title = document.title || path;

    setTabs((prevTabs) => {
      const existingTab = prevTabs.find((tab) => tab.path === path);
      if (existingTab) {
        setActiveKey(existingTab.key);
        return prevTabs;
      }

      const newTab: TabItem = {
        key: path,
        title,
        path,
        closable: true,
      };

      setActiveKey(path);
      return [...prevTabs, newTab];
    });
  }, [location]);

  // 处理标签页切换
  const handleTabChange = useCallback(
    (key: string) => {
      const tab = tabs.find((t) => t.key === key);
      if (tab) {
        navigate(tab.path);
      }
    },
    [tabs, navigate]
  );

  // 处理标签页关闭
  const handleTabClose = useCallback(
    (targetKey: string) => {
      setTabs((prevTabs) => {
        const newTabs = prevTabs.filter((tab) => tab.key !== targetKey);
        if (newTabs.length === 0) {
          navigate("/");
          return [
            {
              key: "home",
              title: "首页",
              path: "/",
              closable: false,
            },
          ];
        }

        if (targetKey === activeKey) {
          const lastTab = newTabs[newTabs.length - 1];
          navigate(lastTab.path);
        }

        return newTabs;
      });
    },
    [activeKey, navigate]
  );

  // 处理右键菜单
  const handleContextMenu = useCallback((e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetKey: key,
    });
  }, []);

  // 关闭右键菜单
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  // 刷新当前页面
  const handleRefresh = useCallback(() => {
    const tab = tabs.find((t) => t.key === contextMenu.targetKey);
    if (tab) {
      navigate(tab.path, { replace: true });
    }
    handleCloseContextMenu();
  }, [contextMenu.targetKey, tabs, navigate, handleCloseContextMenu]);

  // 关闭其他标签页
  const handleCloseOthers = useCallback(() => {
    const currentTab = tabs.find((t) => t.key === contextMenu.targetKey);
    if (currentTab) {
      setTabs([currentTab]);
      navigate(currentTab.path);
    }
    handleCloseContextMenu();
  }, [contextMenu.targetKey, tabs, navigate, handleCloseContextMenu]);

  // 关闭所有标签页
  const handleCloseAll = useCallback(() => {
    setTabs([
      {
        key: "home",
        title: "首页",
        path: "/",
        closable: false,
      },
    ]);
    navigate("/");
    handleCloseContextMenu();
  }, [navigate, handleCloseContextMenu]);

  // 监听全局点击事件，关闭右键菜单
  useEffect(() => {
    const handleGlobalClick = () => {
      handleCloseContextMenu();
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [handleCloseContextMenu]);

  return (
    <div className={styles.customTabsContainer}>
      <div className={styles.tabsWrapper}>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          type="editable-card"
          hideAdd
          onEdit={(targetKey, action) => {
            if (action === "remove" && typeof targetKey === "string") {
              handleTabClose(targetKey);
            }
          }}
          items={tabs.map((tab) => ({
            key: tab.key,
            label: (
              <span
                className={styles.tabItem}
                onContextMenu={(e) => handleContextMenu(e, tab.key)}
              >
                {tab.title}
              </span>
            ),
            closable: tab.closable,
          }))}
        />
      </div>

      <div className={styles.contentWrapper}>
        {tabs.map((tab) => (
          <KeepAlive
            key={tab.key}
            id={tab.key}
            name={tab.key}
            when={tab.key === activeKey}
          >
            <div style={{ display: tab.key === activeKey ? "block" : "none" }}>
              {/* 这里可以放置路由组件 */}
            </div>
          </KeepAlive>
        ))}
      </div>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRefresh={handleRefresh}
          onCloseOthers={handleCloseOthers}
          onCloseAll={handleCloseAll}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

export default CustomTabs;
