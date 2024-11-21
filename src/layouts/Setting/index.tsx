import { WjDrawer } from "magical-antd-ui";
import React, { useEffect, useState } from "react";
import "./style.less";
import ThemeSetting from "./ThemeSetting";
import ThemeColor from "./ThemeColor";
import { SystemThemeEnum, ElementPlusTheme } from "@/config/setting";

const MyDrawerChild = ({
  onChgTheme,
}: {
  onChgTheme?: (theme: SystemThemeEnum) => void;
}) => {
  const drawer = WjDrawer.useDrawer();
  const [autoClose, setAutoClose] = useState(false);
  const [mainColor, setMainColor] = useState(ElementPlusTheme?.primary);
  const onChgMainTheme = (color: string) => {
    setMainColor(color);
  };
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
      <div className="drawer-con">
        <ThemeSetting
          isAutoClose={isAutoClose}
          onChgTheme={onChgTheme}
          mainColor={mainColor}
        />
        <ThemeColor onChgMainTheme={onChgMainTheme} />
      </div>
    </WjDrawer>
  );
};
const Setting = WjDrawer.create(MyDrawerChild);
export { Setting, MyDrawerChild };
