import React, { useState, useEffect } from "react";
import { Button } from "antd";
import SettingConfig from "./components/SettingsDrawer";
import { useTheme } from "./hooks/useTheme";
import { useModel } from "umi";
import { SystemThemeEnum, ElementPlusTheme } from "@/config/setting";
export default function Index() {
  const { setSystemTheme, setSystemAutoTheme, setElementThemeColor } =
    useTheme();
  const [visibleSetting, setVisibleSetting] = useState(false);
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const { systemThemeMode, systemThemeType, systemThemeColor } =
    useModel("themeColor"); // 系统主题变量

  // 监听系统主题变化
  const listenerSystemTheme = () => {
    mediaQuery.addEventListener("change", initSystemTheme);
  };

  // 初始化系统主题
  const initSystemTheme = () => {
    if (systemThemeMode === SystemThemeEnum.AUTO) {
      setSystemAutoTheme();
    } else {
      setSystemTheme(systemThemeType);
    }
  };

  useEffect(() => {
    listenerSystemTheme();
    initSystemTheme();
    setElementThemeColor(systemThemeColor);
    return () => {
      mediaQuery.removeEventListener("change", initSystemTheme);
    };
  }, []);
  return (
    <>
      <SettingConfig
        onClose={() => {
          setVisibleSetting(false);
        }}
        open={visibleSetting}
      />
      <Button
        onClick={() => {
          setVisibleSetting(true);
        }}
      >
        设置
      </Button>
    </>
  );
}
