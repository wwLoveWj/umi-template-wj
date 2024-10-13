// import { Link, Outlet } from "umi";
import styles from "./index.less";
// import { removeToken } from "@/utils/localToken";
// import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { message, notification } from "antd";
import React, { useEffect } from "react";
import { history, useLocation } from "umi";
import { storage } from "@/utils/storage";
import { PROJECT_CONFIG } from "@/constants/constant";
import { WjLayout } from "magical-antd-ui";
import routes from "@/routes"; // 配置的菜单项

// 获取到所有的菜单数据进行处理
const menus =
  routes
    ?.find((route) => route.path === "/")
    ?.routes?.filter((item: any) => !item.redirect) || [];
export default function Layout() {
  // const mailInfo = storage.get("login-info");
  // const { pathname } = useLocation();
  // 获取当前项目根节点
  const homeWrapper = document.getElementById(
    PROJECT_CONFIG?.NAME
  ) as HTMLElement;
  const ChangeUserOperation = () => {
    const callEvent = () => {
      localStorage.setItem("lastTime", new Date().getTime().toString());
    };

    homeWrapper.addEventListener("click", callEvent);
    homeWrapper.addEventListener("keydown", callEvent);
    homeWrapper.addEventListener("mouseover", callEvent);
    homeWrapper.addEventListener("mousewheel", callEvent);
  };
  useEffect(() => {
    //windows上设置一个循环定时器，每隔一秒调用一次监听函数，并定义在全局global上,用于超时后清除
    ChangeUserOperation();
    const CheckOpartionTimer = setInterval(() => {
      const _lastTime =
        (Number(localStorage.getItem("lastTime")) as number) * 1;
      const nowTime = new Date().getTime();
      console.log(
        _lastTime,
        "nowTime----------------------------------",
        nowTime
      );
      if (nowTime - _lastTime > 1000 * 1000) {
        console.log(
          "当前时间：",
          nowTime,
          "最新时间",
          _lastTime,
          "间隔：",
          nowTime - _lastTime,
          "超时了，已退出登录"
        );
        message.warning("长时间未操作，即将退出登录");
        // notification.error({ message: "'长时间未操作，已退出登录'" });
        // 清除计时器
        clearInterval(CheckOpartionTimer);

        // 延迟一段时间后再进行导航
        setTimeout(() => {
          // 断开连接，退出
          history.push("/login");
        }, 2000); // 延迟2秒
      }
    }, 1000);
    return () => {
      clearInterval(CheckOpartionTimer);
      localStorage.clear();
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
            storage.del("login-info");
            storage.del("menuList");
            localStorage.clear();
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
  return (
    <div className={styles.navs}>
      <WjLayout
        isShowHeader={false}
        avatarItems={avatarItems}
        // rolesList={rolesList}
        routes={menus}
        projectName={PROJECT_CONFIG.TITLE}
      />
    </div>
  );
}
