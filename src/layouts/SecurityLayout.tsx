// import { Link, Outlet } from "umi";
import "./index.less";
import { removeToken } from "@/utils/localToken";
import { SettingOutlined, BellOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { message, notification, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { history, useLocation, useModel } from "umi";
import { storage } from "@/utils/storage";
import { PROJECT_CONFIG } from "@/constants/constant";
import { WjLayout, WjDrawer } from "magical-antd-ui";
import routes from "@/routes"; // 配置的菜单项
import { Setting } from "./Setting";
import ThemeSetting from "./Setting/ThemeSetting";
import ThemeMenuType from "./Setting/ThemeMenuType";
import Carousel from "./tools/Carousel";
import Notice from "@/pages/home/notice";
import LogoIndex from "./logo/index";
import { ElementPlusTheme, SystemThemeEnum } from "@/config/setting";
// 获取到所有的菜单数据进行处理
const menus =
  routes
    ?.find((route) => route.path === "/")
    ?.routes?.filter((item: any) => !item.redirect) || [];
const systemThemeColor = ElementPlusTheme.primary;
export default function Layout() {
  const [showNotice, setShowNotice] = useState(false);
  // const { pathname } = useLocation();
  // const { currentMenuTheme } = useModel("themeColor");
  const [currentMenuTheme, setMenuTheme] = useState(
    localStorage.getItem("menuType")
  );
  debugger;
  const [currentTheme, setCurrentTheme] = useState(
    JSON.parse(
      localStorage?.getItem("systemColor") || `{systemThemeMode:light}`
    )?.systemThemeMode
  );
  const [showSettingGuide] = useState(true);

  const clearLocalStorage = () => {
    storage.del("login-info");
    storage.del("menuList");
    removeToken();
  };
  // 获取当前项目根节点
  const homeWrapper = document.getElementById(
    PROJECT_CONFIG?.NAME
  ) as HTMLElement;
  // 监听长时间不操作的用户自动退出登录
  const ChangeUserOperation = () => {
    const callEvent = () => {
      localStorage.setItem("lastTime", new Date().getTime().toString());
    };

    homeWrapper.addEventListener("click", callEvent);
    homeWrapper.addEventListener("keydown", callEvent);
    homeWrapper.addEventListener("mouseover", callEvent);
    homeWrapper.addEventListener("mousewheel", callEvent);
  };

  const bodyCloseNotice = (e: any) => {
    let { className } = e.target;
    debugger;
    if (showNotice) {
      if (typeof className === "object") {
        setShowNotice(false);
        return;
      }
      if (className.indexOf("notice-btn") === -1) {
        setShowNotice(false);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("click", bodyCloseNotice);
    //windows上设置一个循环定时器，每隔一秒调用一次监听函数，并定义在全局global上,用于超时后清除
    ChangeUserOperation();
    const CheckOpartionTimer = setInterval(() => {
      const _lastTime =
        (Number(localStorage.getItem("lastTime")) as number) * 1;
      const nowTime = new Date().getTime();
      // console.log(
      //   _lastTime,
      //   "nowTime----------------------------------",
      //   nowTime
      // );
      if (nowTime - _lastTime > 1000 * 3600 * 24) {
        // console.log(
        //   "当前时间：",
        //   nowTime,
        //   "最新时间",
        //   _lastTime,
        //   "间隔：",
        //   nowTime - _lastTime,
        //   "超时了，已退出登录"
        // );
        message.warning("长时间未操作，即将退出登录");
        // notification.error({ message: "'长时间未操作，已退出登录'" });
        // 清除计时器
        clearInterval(CheckOpartionTimer);

        // 延迟一段时间后再进行导航
        // setTimeout(() => {
        //   // 断开连接，退出
        //   history.push("/login");
        // }, 2000); // 延迟2秒
      }
    }, 1000);
    // 菊花效果
    // let flowerContainer = document.querySelector(".my-template-umi-ant-menu");
    // flowerContainer.addEventListener("mousemove", function (e) {
    //   let body = document.querySelector("body") as HTMLBodyElement;
    //   let flower = document.createElement("div");
    //   flower.setAttribute("id", "flower");
    //   let x = e.offsetX;
    //   let y = e.offsetY;
    //   flower.style.left = x + "px";
    //   flower.style.top = y + "px";

    //   let size = Math.random() * 80;
    //   flower.style.width = 20 + size + "px";
    //   flower.style.height = 20 + size + "px";

    //   let rotation = Math.random() * 360;
    //   flower.style.transform = `rotate(${rotation}deg)`;

    //   body.appendChild(flower);

    //   setTimeout(function () {
    //     flower.remove();
    //   }, 2000);
    // });
    return () => {
      document.addEventListener("click", bodyCloseNotice);
      clearInterval(CheckOpartionTimer);
      clearLocalStorage();
      homeWrapper.removeEventListener("click", function () {});
      homeWrapper.removeEventListener("keydown", function () {});
      homeWrapper.removeEventListener("mouseover", function () {});
      homeWrapper.removeEventListener("mousewheel", function () {});
    };
  }, []);

  // 退出登录操作
  // const loginOut = () => {
  //   const { location } = history;
  //   const search = location?.search
  //     ? location?.search.substring(0, 1) === "?"
  //       ? location.search
  //       : `?${location.search}`
  //     : "";
  //   window.location.href = `${window.location.origin}${
  //     mailInfo?.loginPath || "/login"
  //   }?redirect=${pathname}${search}`;
  //   storage.del("login-info");
  //   storage.del("menuList");
  //   removeToken();
  // };

  // settings的菜单
  const avatarItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            history.push("/login");
          }}
        >
          退出登录
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            history.push("/center");
          }}
        >
          个人中心
        </a>
      ),
    },
  ];

  // 监听更改主题颜色
  const onChgTheme = (theme: SystemThemeEnum) => {
    setCurrentTheme(theme);
    setMenuTheme(theme);
  };

  return (
    <div>
      <WjLayout
        isShowHeader={false}
        avatarItems={avatarItems}
        // rolesList={rolesList}
        routes={menus}
        home="/home"
        projectName={
          <div className="logo-title" theme={currentMenuTheme}>
            <LogoIndex theme={currentMenuTheme} />
            <div>{PROJECT_CONFIG.TITLE}</div>
          </div>
        }
        headerStyle={{
          background: `var(--art-main-bg-color)`,
          color: `var(--art-text-gray-700)`,
        }}
        themeMenu={currentMenuTheme}
        extraRender={
          <div style={{ display: "flex" }}>
            <Carousel />
            {/* 设置  */}
            <div
              className="btn-box"
              onClick={() => WjDrawer.open(Setting, { onChgTheme })}
            >
              {showSettingGuide && (
                <Popover
                // content={
                //   <p>
                //     点击这里查看
                //     <span style={{ color: systemThemeColor }}>主题风格</span>
                //     、
                //     <span style={{ color: systemThemeColor }}>
                //       开启顶栏菜单
                //     </span>
                //     等更多配置
                //   </p>
                // }
                // title="Title"
                >
                  <>
                    <div className="btn setting-btn">
                      <SettingOutlined />
                    </div>
                  </>
                </Popover>
              )}
            </div>
            {/* 通知  */}
            <div
              className="btn-box notice-btn"
              onClick={() => setShowNotice(!showNotice)}
            >
              <div className="btn notice-button">
                <BellOutlined />
                <span className="count notice-btn"></span>
              </div>
            </div>
          </div>
        }
      />
      <Notice show={showNotice} />
      <div style={{ display: "none" }}>
        <ThemeSetting />
      </div>
      <div style={{ display: "none" }}>
        <ThemeMenuType />
      </div>
    </div>
  );
}
