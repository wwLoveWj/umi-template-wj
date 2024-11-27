// 自定义当前formItem表单
import React from "react";

const CustomFormItem = ({
  onChange,
  value,
  children,
}: {
  onChange?: (v: any) => void;
  value?: any;
  children: (v: {
    onChange?: (v: any) => void;
    value?: any;
  }) => React.ReactNode | Element;
}): any => {
  if (React.isValidElement(children)) {
    return children;
  }
  if (children instanceof Function) {
    return children({ onChange, value });
  }
  return null;
};

export default CustomFormItem;

// 自定义使用iconfont图标
// 组织的收起关闭逻辑
// 自定义组件的封装
