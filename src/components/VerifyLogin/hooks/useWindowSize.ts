import { useState, useEffect } from "react";

function useWindowSize() {
  // 初始化状态为 window.innerWidth 和 window.innerHeight
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // 定义一个回调函数来更新窗口尺寸
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 添加事件监听器
    window.addEventListener("resize", handleResize);

    // 清除事件监听器
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 空数组表示这个 effect 只会在组件挂载和卸载时运行

  return windowSize;
}

export default useWindowSize;
