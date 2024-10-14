import React from "react";
import { WjForm, FormItemConfigLsitType } from "@/components/WjForm";
import { history } from "umi";
export default function Index() {
  const formConfigList1: FormItemConfigLsitType[] = [
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

  return (
    <div>
      收藏管理
      <WjForm
        formConfigList={formConfigList1}
        btnConfig={{
          submitTxt: "提交",
          cancelTxt: "取消",
          onCancel: () => {
            debugger;
            history.push("/article");
          },
        }}
      />
    </div>
  );
}
