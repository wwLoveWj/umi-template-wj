import React, { useState } from "react";
import classNames from "classnames";
import VerifyLogin from "./SliderAuthentication";
import "./style.less";
import useWindowSize from "./hooks/useWindowSize";

export default function Index({
  isClickPass,
  isPassing,
  chgValue,
}: {
  isClickPass: boolean;
  isPassing: boolean;
  chgValue: (params: boolean) => void;
}) {
  //   const [isPassing, setIsPassing] = useState(false); //是否通过了校验
  //   const [isClickPass, setIsClickPass] = useState(false); //记录是否点击过通过按钮
  const { width } = useWindowSize();
  return (
    <div className="drag-verify">
      <div
        className={classNames("drag-verify-content", {
          error: !isPassing && isClickPass,
        })}
      >
        <VerifyLogin
          // ref={dragVerify}
          value={isPassing}
          chgValue={chgValue}
          width={width < 850 ? 265.84 : 410.93}
          text="按住滑块拖动"
          textColor="var(--art-gray-800)"
          successText="验证成功"
          progressBarBg={"#38C0FC"}
          background="var(--art-gray-200)"
          handlerBg="var(--art-main-bg-color)"
          // onPass={onPass}
        />
      </div>
      <p
        className={classNames("error-text", {
          "show-error-text": !isPassing && isClickPass,
        })}
      >
        请拖动滑块完成验证
      </p>
    </div>
  );
}
