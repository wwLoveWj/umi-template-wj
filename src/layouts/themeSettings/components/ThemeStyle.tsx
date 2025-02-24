import React from "react";
import { useModel } from "umi";
import classNames from "classnames";
import { SettingThemeList } from "@/config/setting";
import { useTheme } from "../hooks/useTheme";
import "../style.scss";

const ThemeStyle = () => {
  const { switchTheme } = useTheme();
  const { systemThemeMode, setMenuTheme } = useModel("themeColor"); // 系统主题变量

  return (
    <>
      <p className="title">主题风格</p>
      <div className="theme-wrap">
        {SettingThemeList?.map((item, index) => (
          <div
            className="theme-item"
            key={item.theme}
            onClick={() => {
              switchTheme(item.theme);
              if (item.theme === "dark") {
                setMenuTheme(item.theme);
              }
            }}
          >
            <div
              className={classNames("box", {
                "is-active": item.theme === systemThemeMode,
              })}
            >
              <div style={{ background: item.color[0] }}>
                {[1, 2, 3]?.map((cItem, index) => (
                  <div
                    key={index}
                    className={"line" + index}
                    style={{ background: item.leftLineColor }}
                  ></div>
                ))}
              </div>
              <div
                style={{
                  background: index === 2 ? item.color[1] : item.color[0],
                }}
              >
                {[1, 2, 3]?.map((cItem, index) => (
                  <div
                    key={index}
                    className={"line" + index}
                    style={{ background: item.rightLineColor }}
                  ></div>
                ))}
              </div>
            </div>
            {/* 最底下的名称及绿点 */}
            <p className="name">{item?.name}</p>
            {item.theme === systemThemeMode && <div className="active"></div>}
          </div>
        ))}
      </div>
    </>
  );
};

export default ThemeStyle;
