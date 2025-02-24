import { Drawer } from "antd";
import React from "react";
import ThemeSetting from "./ThemeStyle";
import ThemeColor from "./ThemeColor";
import ThemeShadow from "./ThemeShadow";
import ThemeMenuType from "./ThemeMenuType";

export default function Index({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) {
  //   const [autoClose, setAutoClose] = useState(false);
  //   // 自动关闭
  //   const isAutoClose = () => {
  //     if (autoClose) {
  //     }
  //   };
  return (
    <Drawer title="Basic Drawer" onClose={onClose} open={open}>
      <div className="drawer-con">
        <ThemeSetting />
        <ThemeMenuType />
        <ThemeColor />
        <ThemeShadow />
      </div>
    </Drawer>
  );
}
