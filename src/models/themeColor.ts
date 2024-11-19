import React, { useState } from "react";
// 获取用户信息
const themeInfo = () => {
  const [currentTheme, setCurrentTheme] = useState(
    JSON.parse(
      localStorage?.getItem("systemColor") || `{systemThemeMode:light}`
    )?.systemThemeMode
  );
  debugger;
  return {
    currentTheme,
    setCurrentTheme,
  };
};

export default themeInfo;
