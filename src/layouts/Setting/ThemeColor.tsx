import React, { useEffect, useState } from "react";
import { useModel } from "umi";
import { CheckOutlined } from "@ant-design/icons";
import { SystemMainColor, ElementPlusTheme } from "@/config/setting";
import { handleElementThemeColor, colourBlend } from "@/utils/color";
import "./style.scss";
const mainColor = SystemMainColor;

export default function ThemeColor({
  onChgMainTheme,
}: {
  onChgMainTheme: (color: string) => void;
}) {
  const [systemThemeColor, setSystemThemeColor] = useState(
    ElementPlusTheme.primary
  );
  const isDark =
    JSON.parse(
      localStorage?.getItem("systemColor") || `{systemThemeType:light}`
    )?.systemThemeType === "dark";
  function setElementThemeColor(color: string) {
    const mixColor = "#ffffff";
    const elStyle = document.documentElement.style;

    elStyle.setProperty("--antd-color-primary", color);
    handleElementThemeColor(color, isDark);

    // 生成更淡一点的颜色
    for (let i = 1; i < 16; i++) {
      const itemColor = colourBlend(color, mixColor, i / 16);
      elStyle.setProperty(`--antd-color-primary-custom-${i}`, itemColor);
    }
  }
  const setElementTheme = (theme: string) => {
    // theme = theme.split(',')[2].replace(')', '')
    setSystemThemeColor(theme);
    setElementThemeColor(theme);
    if (onChgMainTheme) onChgMainTheme(theme);
  };

  useEffect(() => {
    setElementThemeColor(ElementPlusTheme.primary);
  }, []);
  return (
    <>
      <p className="title" style={{ marginTop: "30px" }}>
        主题色
      </p>
      <div className="main-color-wrap">
        <div className="offset">
          {mainColor?.map((color) => (
            <div
              key={color}
              style={{ background: `${color}` }}
              onClick={() => setElementTheme(color)}
            >
              {color == systemThemeColor && <CheckOutlined />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
