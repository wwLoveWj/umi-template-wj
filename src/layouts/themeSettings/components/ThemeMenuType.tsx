import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { ThemeList, MenuThemeEnum, SystemThemeEnum } from "@/config/setting";
import "../style.scss";
import { useModel } from "umi";
import { storage } from "@/utils/storage";

const menuThemeList = ThemeList;
export default function ThemeMenuType() {
  const { currentMenuTheme, setMenuTheme } = useModel(
    "themeColor",
    (model) => ({
      currentMenuTheme: model.currentMenuTheme,
      setMenuTheme: model.setMenuTheme,
    })
  );

  return (
    <div>
      <p className="title" style={{ marginTop: "30px" }}>
        菜单风格
      </p>
      <div className="menu-theme-wrap">
        <div>
          {menuThemeList?.map((item, index) => (
            <div
              className="item"
              key={item.theme}
              onClick={() => {
                setMenuTheme(item.theme);
                storage.set("menuTheme", item.theme);
                // 给aside身上添加样式
                let menu = document.getElementsByTagName("aside")[0];
                menu.setAttribute("theme", item.theme);
              }}
            >
              <div
                className={classNames("box", {
                  "is-active": item.theme === currentMenuTheme,
                })}
              >
                <div
                  className="top"
                  style={{ background: item.tabBarBackground }}
                ></div>
                {[1, 2, 3]?.map((cItem, index) => (
                  <div className="left" style={{ background: item.background }}>
                    <div
                      key={index}
                      className={"line" + index}
                      style={{ background: item.leftLineColor }}
                    />
                  </div>
                ))}
                {[1, 2, 3]?.map((cItem, index) => (
                  <div className="right">
                    <div
                      key={index}
                      className={"line" + index}
                      style={{ background: item.rightLineColor }}
                    />
                  </div>
                ))}
              </div>
              <p className="name">{item?.theme}</p>
              {item.theme === currentMenuTheme && <div className="active" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
