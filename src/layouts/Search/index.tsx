import React, { useEffect } from "react";
import "./search.less";
import mittBus from "@/utils/mittBus";
import { SearchOutlined } from "@ant-design/icons";
export default function Index() {
  // 监听键盘，设置按"k"键可以弹起弹窗
  const handleKeydown = (event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const isCommandKey = isMac ? event.metaKey : event.ctrlKey;
    if (isCommandKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      mittBus.emit("openSearchDialog");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);
  return (
    <div className="search-wrap">
      <div
        className="search-input"
        onClick={() => mittBus.emit("openSearchDialog")}
      >
        <div className="left">
          <SearchOutlined />
          <span>搜索</span>
        </div>
        <div className="search-keydown">
          {/* const isWindows = navigator.userAgent.includes('Windows') */}
          {/* <i className="iconfont-sys" v-if="isWindows">
                    &#xeeac;
                  </i> */}
          <i className="iconfont-sys">Ctrl</i>
          <span>k</span>
        </div>
      </div>
    </div>
  );
}
