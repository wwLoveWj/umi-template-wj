import React, { useState, useRef, useEffect } from "react";
import CardInfo from "./card/index";
import mittBus from "@/utils/mittBus";
import { Button } from "antd";
import bp from "@/assets/imgs/ceremony/hb.png";
import sd from "@/assets/imgs/ceremony/sd.png";
import Fireworks from "@/pages/fires/Fireworks";
// import flower from "@/assets/imgs/flower.png";
export default () => {
  const [isLaunching, setLaunching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleImageLaunch = (src: string) => {
    mittBus.emit("triggerFireworks", src);
  };

  const triggerFireworks = (count: number, src: string) => {
    // 清除之前的定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setLaunching(true); // 开始发射时设置状态

    let fired = 0;
    timerRef.current = setInterval(() => {
      mittBus.emit("triggerFireworks", src);
      fired++;

      // 达到指定次数后清除定时器
      if (fired >= count) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setLaunching(false); // 发射完成后解除禁用
      }
    }, 1000);
  };
  const handleMultipleLaunch = (src: string) => {
    triggerFireworks(10, src);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  return (
    <div>
      <Fireworks />
      <Button disabled={isLaunching} onClick={() => handleImageLaunch("")}>
        ✨ 放个小烟花
      </Button>
      <Button disabled={isLaunching} onClick={() => handleImageLaunch(bp)}>
        🎉 打开幸运红包
      </Button>
      <Button disabled={isLaunching} onClick={() => handleMultipleLaunch("")}>
        🎆 璀璨烟火秀
      </Button>
      <Button disabled={isLaunching} onClick={() => handleImageLaunch(sd)}>
        ❄️ 飘点小雪花
      </Button>
      <Button disabled={isLaunching} onClick={() => handleMultipleLaunch(sd)}>
        ❄️ 浪漫暴风雪
      </Button>
      <CardInfo />
    </div>
  );
};
