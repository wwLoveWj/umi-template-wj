import { WjDrawer } from "magical-antd-ui";
import React, { useEffect, useState } from "react";
import {
  SettingThemeList,
  ThemeList,
  SystemMainColor,
  SystemThemeStyles,
  SystemThemeEnum,
  ElementPlusTheme,
} from "@/config/setting";
import { getDarkColor, getLightColor } from "@/utils/color";
import "./style.less";
import classNames from "classnames";

const MyDrawer = WjDrawer.create(() => {
  const drawer = WjDrawer.useDrawer();
  const [autoClose, setAutoClose] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(
    JSON.parse(
      localStorage?.getItem("systemColor") || `{systemThemeType:light}`
    )?.systemThemeType
  );
  // 系统主题变量存储到 vuex 里面
  const setSystemThemeModel = (
    theme: SystemThemeEnum,
    themeMode: SystemThemeEnum
  ) => {
    setCurrentTheme(themeMode);
    localStorage.setItem(
      "systemColor",
      JSON.stringify({
        systemThemeType: theme,
        systemThemeMode: themeMode,
      })
    );
    isAutoClose();
  };

  // 自动关闭
  const isAutoClose = () => {
    if (autoClose) {
      drawer.close();
    }
  };

  // 监听系统主题变化
  const listenerSystemTheme = () => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", initSystemTheme);
  };

  // 初始化系统主题
  const initSystemTheme = () => {
    if (currentTheme === SystemThemeEnum.AUTO) {
      setSystemAutoTheme();
    } else {
      setSystemTheme(
        JSON.parse(
          localStorage?.getItem("systemColor") || `{systemThemeType:light}`
        )?.systemThemeType
      );
    }
  };
  // 设置系统主题
  const setSystemTheme = (
    theme: SystemThemeEnum,
    themeMode?: SystemThemeEnum
  ) => {
    // 给html身上添加样式
    let el = document.getElementsByTagName("html")[0];
    let isDark = theme === SystemThemeEnum.DARK;

    if (!themeMode) {
      themeMode = theme;
    }
    // 获取对应系统色样式
    const currentSysTheme = SystemThemeStyles[theme];
    if (currentSysTheme) {
      el.setAttribute("class", currentSysTheme.className);
    }

    // 设置按钮颜色加深或变浅
    let primary = ElementPlusTheme.primary;

    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        isDark
          ? `${getDarkColor(primary, i / 10)}`
          : `${getLightColor(primary, i / 10)}`
      );
    }
    // 保存系统色
    setSystemThemeModel(theme, themeMode);
  };
  // 主题跟随系统
  const setSystemAutoTheme = () => {
    debugger;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setSystemTheme(SystemThemeEnum.DARK, SystemThemeEnum.AUTO);
    } else {
      setSystemTheme(SystemThemeEnum.LIGHT, SystemThemeEnum.AUTO);
    }
  };
  // 切换系统主题
  const switchTheme = (theme: SystemThemeEnum) => {
    if (theme === SystemThemeEnum.AUTO) {
      setSystemAutoTheme();
    } else {
      setSystemTheme(theme);
    }
  };

  useEffect(() => {
    initSystemTheme();
  }, []);
  return (
    <WjDrawer
      {...drawer.props}
      className="my-drawer"
      footer={null}
      width={"20%"}
    >
      <div className="drawer-con">
        <p className="title">主题风格</p>
        <div className="theme-wrap">
          {SettingThemeList?.map((item, index) => (
            <div
              className="theme-item"
              key={item.theme}
              onClick={() => switchTheme(item.theme)}
            >
              <div
                className={classNames("box", {
                  "is-active": item.theme === currentTheme,
                })}
              >
                <div style={{ background: item.color[0] + "!important" }}>
                  {[1, 2, 3]?.map((cItem, index) => (
                    <div
                      // v-for="(cItem, index) in 3"
                      key={index}
                      className={"line" + index}
                      style={{ background: item.leftLineColor }}
                    ></div>
                  ))}
                </div>
                <div
                  style={{
                    background:
                      index === 2
                        ? item.color[1]
                        : item.color[0] + "!important",
                  }}
                >
                  {[1, 2, 3]?.map((cItem, index) => (
                    <div
                      // v-for="(cItem, index) in 3"
                      key={index}
                      className={"line" + index}
                      style={{ background: item.rightLineColor }}
                    ></div>
                  ))}
                </div>
              </div>
              {/* 最底下的名称及绿点 */}
              <p className="name">{item?.name}</p>
              {item.theme === currentTheme && <div className="active"></div>}
            </div>
          ))}
        </div>
      </div>
    </WjDrawer>
  );
});

export default MyDrawer;
