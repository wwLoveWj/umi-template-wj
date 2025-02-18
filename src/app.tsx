import "@/styles/reset.scss"; // 重置HTML样式
import "@/styles/antd-ui.scss"; // 优化element样式
import "@/styles/dark.scss"; // 系统主题
import "./global.less";
// import "@/assets/icons/icons/iconfont.css";

import { ConfigProvider } from "antd";
import Package from "../package.json";
import React from "react";
import zhCN from "antd/es/locale/zh_CN";
import { MsConfigProvider } from "magical-antd-ui";
// import vstores from "vstores";

// let loginInfo = vstores.get("login-info");
// import { autoFixContext } from "react-activation";
// import jsxDevRuntime from "react/jsx-dev-runtime";
// import jsxRuntime from "react/jsx-runtime";

// autoFixContext(
//   [jsxRuntime, "jsx", "jsxs", "jsxDEV"],
//   [jsxDevRuntime, "jsx", "jsxs", "jsxDEV"]
// );
// 初始化路由菜单数据
// export async function getInitialState() {
//   return {};
// }

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.locale("zh-cn");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function rootContainer(container: React.ReactNode) {
  ConfigProvider.config({
    prefixCls: Package.name + "-ant",
  });
  return (
    <MsConfigProvider>
      <ConfigProvider prefixCls={Package.name + "-ant"} locale={zhCN}>
        {container}
      </ConfigProvider>
    </MsConfigProvider>
  );
}

export async function render(oldRender: any) {
  oldRender();
}
