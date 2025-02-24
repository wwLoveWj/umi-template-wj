import React, { useEffect } from "react";
import { useModel } from "umi";
import { CheckOutlined } from "@ant-design/icons";
import { SystemMainColor, ElementPlusTheme } from "@/config/setting";
import { useTheme } from "../hooks/useTheme";
import { storage } from "@/utils/storage";
import "../style.scss";

const mainColor = SystemMainColor;

export default function ThemeColor() {
  const { systemThemeColor, setSystemThemeColor, systemThemeType } =
    useModel("themeColor");
  const { setElementThemeColor } = useTheme();

  const setElementTheme = (color: string) => {
    // theme = theme.split(',')[2].replace(')', '')
    setSystemThemeColor(color);
    storage.set("themeColor", color);
    setElementThemeColor(color);
  };

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
