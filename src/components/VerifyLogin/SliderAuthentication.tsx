import React, { useState, useRef, useEffect, useMemo } from "react";
import classNames from "classnames";
import { SendOutlined, CheckOutlined } from "@ant-design/icons";
import "./style.less";

interface IPropsType {
  value: boolean;
  width?: number;
  height?: number;
  text?: string;
  successText?: string;
  background?: string;
  progressBarBg?: string;
  completedBg?: string;
  circle?: boolean;
  radius?: string;
  handlerIcon?: string;
  successIcon?: string;
  handlerBg?: string;
  textSize?: string;
  textColor?: string;
  textBefore?: React.ReactNode;
  textAfter?: React.ReactNode;
  chgValue: (params: boolean) => void;
}

export default function Index(props: IPropsType) {
  //   const emit = defineEmits(['handlerMove', 'update:value', 'passCallback'])
  const {
    value = false,
    width = 260,
    height = 44,
    text = "按住滑块拖动",
    successText = "success",
    background = "#eee",
    progressBarBg = "#1385FF",
    completedBg = "#57D187",
    circle = false,
    radius = "calc(var(--custom-radius) / 2 + 2px)",
    handlerIcon = <SendOutlined />,
    successIcon = <CheckOutlined />,
    handlerBg = "#fff",
    textSize = "13px",
    textColor = "#333",
    textBefore,
    textAfter,
    chgValue,
  } = props;
  const [isMoving, setIsMoving] = useState(false);
  const [isOk, setIsOk] = useState(false);
  const [x, setX] = useState(0);
  const dragVerify = useRef<any>();
  const messageRef = useRef<any>();
  const handlerRef = useRef<any>();
  const progressBar = useRef<any>();

  const handlerStyle = {
    left: "0",
    width: height + "px",
    height: height + "px",
    background: handlerBg,
  };
  const dragVerifyStyle = {
    width: width + "px",
    height: height + "px",
    lineHeight: height + "px",
    background: background,
    borderRadius: circle ? height / 2 + "px" : radius,
  };
  const progressBarStyle = {
    background: progressBarBg,
    height: height + "px",
    borderRadius: circle ? height / 2 + "px 0 0 " + height / 2 + "px" : radius,
  };
  const textStyle = {
    height: height + "px",
    width: width + "px",
    fontSize: textSize,
  };
  const message = useMemo(() => {
    return value ? successText : text;
  }, [value]);

  const dragStart = (e: any) => {
    if (!value) {
      setIsMoving(true);
      handlerRef.current!.style.transition = "none";
      let chgx =
        (e.pageX || e.touches[0].pageX) -
        parseInt(handlerRef.current!.style.left.replace("px", ""), 10);
      setX(chgx);
    }
    // emit('handlerMove')
  };
  const dragMoving = (e: any) => {
    if (isMoving && !value) {
      let _x = (e.pageX || e.touches[0].pageX) - x;
      if (_x > 0 && _x <= width - height) {
        handlerRef.current!.style.left = _x + "px";
        progressBar.current!.style.width = _x + height / 2 + "px";
      } else if (_x > width - height) {
        handlerRef.current!.style.left = width - height + "px";
        progressBar.current!.style.width = width - height / 2 + "px";
        passVerify();
      }
    }
  };
  const dragFinish = (e: any) => {
    if (isMoving && !value) {
      let _x = (e.pageX || e.changedTouches[0].pageX) - x;
      if (_x < width - height) {
        setIsOk(true);
        handlerRef.current!.style.left = "0";
        handlerRef.current!.style.transition = "all 0.2s";
        progressBar.current!.style.width = "0";

        setIsOk(false);
      } else {
        handlerRef.current!.style.transition = "none";
        handlerRef.current!.style.left = width - height + "px";
        progressBar.current!.style.width = width - height / 2 + "px";
        passVerify();
      }
      setIsMoving(false);
    }
  };
  const passVerify = () => {
    chgValue?.(true); //通过校验
    setIsMoving(false);
    progressBar.current!.style.background = completedBg;
    messageRef.current!.style["-webkit-text-fill-color"] = "unset";
    messageRef.current!.style.animation = "slidetounlock2 3s infinite";
    messageRef.current!.style.color = "#fff";
    // emit('passCallback')
  };
  const reset = () => {
    if (handlerRef.current && messageRef.current && progressBar.current) {
      handlerRef.current!.style.left = "0";
      progressBar.current!.valueFormat.style.width = "0";
      handlerRef.current!.children[0].type = handlerIcon;
      messageRef.current!.style["-webkit-text-fill-color"] = "transparent";
      messageRef.current!.style.animation = "slidetounlock 3s infinite";
      messageRef.current!.style.color = background;
    }
  };

  useEffect(() => {
    dragVerify.current?.style.setProperty("--textColor", textColor);
    dragVerify.current?.style.setProperty(
      "--width",
      Math.floor(width / 2) + "px"
    );
    dragVerify.current?.style.setProperty(
      "--pwidth",
      -Math.floor(width / 2) + "px"
    );
  }, []);
  return (
    <div
      ref={dragVerify}
      className="drag_verify"
      style={dragVerifyStyle}
      onMouseUp={dragFinish}
      onMouseLeave={dragFinish}
      onMouseMove={dragMoving}
      onTouchEnd={dragFinish}
      onTouchMove={dragMoving}
    >
      <div
        className={classNames("dv_progress_bar", { goFirst2: isOk })}
        ref={progressBar}
        style={progressBarStyle}
      ></div>
      <div className="dv_text custom-text" style={textStyle} ref={messageRef}>
        {textBefore}
        {message}
        {textAfter}
      </div>
      <div
        className={classNames("dv_handler dv_handler_bg", { goFirst: isOk })}
        onMouseDown={dragStart}
        onTouchStart={dragStart}
        ref={handlerRef}
        style={handlerStyle}
      >
        <i className="iconfont-sys">{value ? successIcon : handlerIcon}</i>
      </div>
    </div>
  );
}
