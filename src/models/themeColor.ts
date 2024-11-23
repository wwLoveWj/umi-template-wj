import React, { useState } from "react";
import { ElementPlusTheme, MenuThemeEnum } from "@/config/setting";
// 获取用户信息
const themeInfo = () => {
  const [systemThemeColor, setSystemThemeColor] = useState(
    ElementPlusTheme?.primary
  );
  debugger;
  const [currentTheme, setCurrentTheme] = useState(
    JSON.parse(
      localStorage?.getItem("systemColor") || `{systemThemeMode:light}`
    )?.systemThemeMode
  );
  const [currentMenuTheme, setMenuTheme] = useState(
    localStorage.getItem("menuType") || MenuThemeEnum.DESIGN
  );
  return {
    currentTheme,
    systemThemeColor,
    setCurrentTheme,
    setSystemThemeColor,
    currentMenuTheme,
    setMenuTheme,
  };
};

export default themeInfo;
