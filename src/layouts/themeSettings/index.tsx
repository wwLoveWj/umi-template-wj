import React, { useEffect } from "react";
import SettingConfig from "./components/SettingsDrawer";
import { useTheme } from "./hooks/useTheme";
import { useModel } from "umi";
import { SystemThemeEnum } from "@/config/setting";

export default function Index({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) {
  const { setSystemTheme, setSystemAutoTheme, setElementThemeColor } =
    useTheme();
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const {
    systemThemeMode,
    systemThemeType,
    systemThemeColor,
    currentMenuTheme,
  } = useModel("themeColor"); // 系统主题变量

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
    // 初始化刷新时的操作初始化
    let menu = document.getElementsByTagName("aside")[0];
    menu.setAttribute("theme", currentMenuTheme);
    return () => {
      mediaQuery.removeEventListener("change", initSystemTheme);
    };
  }, []);
  return (
    <div>
      <SettingConfig onClose={onClose} open={open} />
    </div>
  );
}
