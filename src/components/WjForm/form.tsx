import React from "react";
import { SchemaRender } from "react-schema-render";
import type { FormProps } from "antd";
import { Form, notification } from "antd";
import type { FormInstance } from "antd";
import { WjFormColumnsPropsType } from "./type";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

/**
 * @description 表单传参示例
 * const formConfigList: WjFormColumnsPropsType[] = [
    {
      valueType: "search",
      dataIndex: "username",
      title: "用户名",
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
      valueType: "input",
      dataIndex: "username",
      title: "用户名",
      formItemProps: {
        rules: [{ required: true, message: "请输入用户名" }],
      },
    },
    {
      valueType: "number",
      dataIndex: "age",
      title: "年龄",
      formItemProps: {
        rules: [{ required: true, message: "请输入年龄" }],
      },
    },
    {
      valueType: "password",
      dataIndex: "username",
      title: "用户密码",
      formItemProps: {
        rules: [{ required: true, message: "请输入用户密码" }],
      },
    },
    {
      valueType: "select",
      dataIndex: "userType",
      title: "用户类型",
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
      valueType: "textarea",
      dataIndex: "description",
      title: "描述",
      formItemProps: {
        rules: [{ required: true, message: "请输入描述" }],
      },
      fieldProps: {
        placeholder: "请输入描述",
      },
    },
  ];
 */

export default function Index({
  formConfigList,
  form: formInstance,
  successNotifyProps,
  successNotify = true,
  btnConfig,
}: {
  formConfigList: WjFormColumnsPropsType[];
  form?: FormInstance;
  successNotify?: boolean;
  successNotifyProps?: any;
  btnConfig?: {
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
    colProps: { span: 8 },
    noCard: false,
    form,
    onFinish,
    style: { maxWidth: 1600 },
  };

  // 整体的formItem渲染结果
  const fromItemRender = (config: WjFormColumnsPropsType[]) => {
    return config?.map((column) => {
      return {
        component: "col",
        span: column?.colProps?.span || formItemLayout?.colProps?.span || 12,
        children: {
          component: "formitem",
          label: column?.title,
          name: column?.dataIndex,
          ...column?.formItemProps,
          // 根据type类型来决定渲染的组件
          children: {
            component: column?.valueType,
            ...column?.fieldProps,
            style: { width: "100%" },
          },
        },
      };
    });
  };
  const card = (config: WjFormColumnsPropsType[]) => ({
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
