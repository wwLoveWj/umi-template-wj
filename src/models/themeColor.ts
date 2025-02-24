import React, { useState } from "react";
import { ElementPlusTheme } from "@/config/setting";
import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum } from "@/enums/appEnum";
import { storage } from "@/utils/storage";
// 获取用户信息
const ThemeColor = () => {
  //设置盒子模式
  const [boxBorderMode, setBorderMode] = useState(
    storage.get("borderMode") || false
  );
  // 主题色
  const [systemThemeColor, setSystemThemeColor] = useState(
    storage.get("themeColor") || ElementPlusTheme?.primary
  );
  const [currentTheme, setCurrentTheme] = useState(
    storage.get("systemColor")?.systemThemeMode || SystemThemeEnum.LIGHT
  );
  const [currentMenuTheme, setMenuTheme] = useState(
    storage.get("menuTheme") || MenuThemeEnum.DESIGN
  );
  const [systemThemeMode, setSystemThemeMode] = useState<SystemThemeEnum>(
    storage.get("systemColor")?.systemThemeMode || SystemThemeEnum.LIGHT
  ); // 全局主题类型 light dark
  const [systemThemeType, setSystemThemeType] = useState<SystemThemeEnum>(
    storage.get("systemColor")?.systemThemeType || SystemThemeEnum.LIGHT
  ); // 全局主题模式 light dark auto

  const setGlopTheme = (theme: SystemThemeEnum, themeMode: SystemThemeEnum) => {
    setSystemThemeType(theme);
    setSystemThemeMode(themeMode);
    storage.set("systemColor", {
      systemThemeMode: themeMode,
      systemThemeType: theme,
    });
    // setCurrentTheme(theme);
    // setSystemThemeColor(ElementPlusTheme[theme]);
  };
  return {
    currentTheme,
    systemThemeColor,
    setCurrentTheme,
    setSystemThemeColor,
    currentMenuTheme,
    setMenuTheme,
    setGlopTheme,
    systemThemeType,
    systemThemeMode,
    setBorderMode,
    boxBorderMode,
  };
};

export default ThemeColor;
