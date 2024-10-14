import React from "react";
import { SchemaRender } from "react-schema-render";
import type { FormProps } from "antd";
import { Form, notification } from "antd";
import type { FormInstance } from "antd";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
/**
 * 表单的配置类型
 */
interface FormItemConfigLsitType {
  type:
    | "input"
    | "password"
    | "search"
    | "textarea"
    | "select"
    | "button"
    | "number";
  name?: string;
  label?: string;
  span?: number;
  formItemProps?: any;
  fieldProps?: any;
}
/**
 * @description 表单传参示例
 * const formConfigList: FormItemConfigLsitType[] = [
    {
      type: "search",
      name: "username",
      label: "用户名",
      formItemProps: {
        rules: [{ required: true, message: "用户名必填" }],
      },
      fieldProps: {
        placeholder: "请输入用户名",
        onSearch: (value: string) => {
          console.log("search");
        },
      },
    },
    {
      type: "input",
      name: "username",
      label: "用户名",
      formItemProps: {
        rules: [{ required: true, message: "请输入用户名" }],
      },
    },
    {
      type: "number",
      name: "age",
      label: "年龄",
      formItemProps: {
        rules: [{ required: true, message: "请输入年龄" }],
      },
    },
    {
      type: "password",
      name: "username",
      label: "用户密码",
      formItemProps: {
        rules: [{ required: true, message: "请输入用户密码" }],
      },
    },
    {
      type: "select",
      name: "userType",
      label: "用户类型",
      formItemProps: {
        rules: [{ required: true, message: "请选择用户类型" }],
      },
      fieldProps: {
        options: [
          {
            label: "超级管理员",
            value: "1",
          },
          {
            label: "普通用户",
            value: "2",
          },
        ],
      },
    },
    {
      type: "textarea",
      name: "description",
      label: "描述",
      formItemProps: {
        rules: [{ required: true, message: "请输入描述" }],
      },
      fieldProps: {
        placeholder: "请输入描述",
      },
    },
  ];
 */
export type { FormItemConfigLsitType };
export default function Index({
  formConfigList,
  form: formInstance,
  successNotifyProps,
  successNotify = true,
  btnConfig,
}: {
  formConfigList: FormItemConfigLsitType[];
  form?: FormInstance;
  successNotify?: boolean;
  successNotifyProps?: any;
  btnConfig: {
    onCancel?: () => void;
    cancelTxt?: string;
    submitTxt?: string;
  };
}) {
  const [form] = Form.useForm(formInstance);
  /**
   * 表单提交
   */
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    await formItemLayout?.onFinish(values);
    if (successNotify) {
      notification.success(successNotifyProps || { message: "提交成功" });
    }
  };
  /**
   * 表单提交失败
   */
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.error("Failed:", errorInfo);
    form?.scrollToField(
      { name: errorInfo?.errorFields?.[0]?.name },
      { block: "center", behavior: "smooth" }
    );
  };
  /**
   * 表单布局props
   */
  const formItemLayout = {
    layout: "inline",
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    span: 8,
    noCard: false,
    form,
    onFinish,
    // style: { maxWidth: 600 },
  };

  // 整体的formItem渲染结果
  const fromItemRender = (config: FormItemConfigLsitType[]) => {
    return config?.map((column) => {
      return {
        component: "col",
        span: column?.span || formItemLayout?.span || 12,
        children: {
          component: "formitem",
          label: column?.label,
          name: column?.name,
          ...column?.formItemProps,
          // 根据type类型来决定渲染的组件
          children: {
            component: column?.type,
            ...column?.fieldProps,
            style: { width: "100%" },
          },
        },
      };
    });
  };
  const card = (config: FormItemConfigLsitType[]) => ({
    component: "wjfrom",
    initialValues: { remember: true },
    onFinishFailed,
    autoComplete: "off",
    ...formItemLayout,
    children: {
      component: "row",
      gutter: [0, 20],
      justify: "end",
      children: [
        ...fromItemRender(config),
        {
          component: "space",
          children: [
            {
              component: "button",
              span: 12,
              children: btnConfig?.submitTxt || "查询",
              type: "primary",
              htmlType: "submit",
            },
            {
              component: "button",
              span: 12,
              children: btnConfig?.cancelTxt || "重置",
              onClick: () => {
                (btnConfig?.onCancel && btnConfig?.onCancel()) ||
                  form.resetFields();
              },
            },
          ],
        },
      ],
    },
  });
  const schema = () => {
    //   是否需要卡片包裹
    return formItemLayout?.noCard
      ? card(formConfigList)
      : {
          component: "card",
          children: card(formConfigList),
        };
  };
  return <SchemaRender schema={schema()}></SchemaRender>;
}
