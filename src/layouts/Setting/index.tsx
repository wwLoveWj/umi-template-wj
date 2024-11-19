import { WjDrawer } from "magical-antd-ui";
import React, { useEffect, useState } from "react";
import "./style.less";
import ThemeSetting from "./ThemeSetting";
import { SystemThemeEnum } from "@/config/setting";
const MyDrawerChild = ({
  onChgTheme,
}: {
  onChgTheme?: (theme: SystemThemeEnum) => void;
}) => {
  const drawer = WjDrawer.useDrawer();
  const [autoClose, setAutoClose] = useState(false);

  // 自动关闭
  const isAutoClose = () => {
    if (autoClose) {
      drawer.close();
    }
  };
  return (
    <WjDrawer
      {...drawer.props}
      className="my-drawer"
      footer={null}
      width={"20%"}
    >
      <ThemeSetting isAutoClose={isAutoClose} onChgTheme={onChgTheme} />
    </WjDrawer>
  );
};
const Setting = WjDrawer.create(MyDrawerChild);
export { Setting, MyDrawerChild };
