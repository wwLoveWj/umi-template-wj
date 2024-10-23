import "./global.less";

import { ConfigProvider } from "antd";
import Package from "../package.json";
import React from "react";
import zhCN from "antd/es/locale/zh_CN";
import { MsConfigProvider } from "magical-antd-ui";
// import vstores from "vstores";

// let loginInfo = vstores.get("login-info");

// 初始化路由菜单数据
// export async function getInitialState() {
//   return {};
// }

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
