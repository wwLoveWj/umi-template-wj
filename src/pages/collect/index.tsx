import React from "react";
import { WjForm } from "@/components/WjForm";
import { WjTableColumnType } from "@/components/WjTable";
import { history } from "umi";
export default function Index() {
  const formConfigList1: WjTableColumnType[] = [
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
