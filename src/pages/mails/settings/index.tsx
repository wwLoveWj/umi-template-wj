import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "antd";
import { MsModal } from "magical-antd-ui";
import { WjForm, WjFormColumnsPropsType } from "@/components/WjForm";
import EmailModel from "../templates/EmailModel";
import styles from "../style.less";

const tempList = [
  {
    name: "模板一",
    id: 1,
    color: "RGB(148, 0, 211)",
  },
  {
    name: "模板二",
    color: "red",
    title: "紧急邮件",
    id: 2,
  },
  {
    name: "模板三",
    color: `var(--art-success)`,
    title: "好消息",
    id: 3,
  },
];
const hostList = [
  { value: "smtp.163.com", label: "163邮箱" },
  { value: "smtp.qq.com", label: "qq邮箱" },
];
const secureList = [
  { value: 1, label: "是" },
  { value: 0, label: "否" },
];
const Settings = MsModal.create(() => {
  const modal = MsModal.useModal();
  const [formRef] = Form.useForm();
  // 当前选择的模板ID
  const [tempId, setTempId] = useState(1);
  const columns: WjFormColumnsPropsType[] = [
    {
      dataIndex: "configName",
      title: "配置名称",
      formItemProps: {
        rules: [{ required: true }],
      },
      fieldProps: {
        placeholder: "请填写配置名称",
      },
    },
    {
      dataIndex: "user",
      title: "邮箱",
      formItemProps: {
        rules: [{ required: true }],
      },
      fieldProps: {
        placeholder: "请填写用户邮箱",
      },
    },
    {
      valueType: "password",
      dataIndex: "pass",
      title: "授权码",
      formItemProps: {
        rules: [{ required: true }],
        tooltip: <a>如何获取授权码</a>,
      },
      fieldProps: {
        placeholder: "请填写邮箱授权码",
      },
    },
    {
      valueType: "select",
      dataIndex: "host",
      title: "host",
      formItemProps: {
        rules: [{ required: true }],
      },
      fieldProps: {
        placeholder: "请选择host",
        options: hostList,
      },
    },
    {
      valueType: "radio",
      dataIndex: "secure",
      title: "是否默认",
      formItemProps: {
        initialValue: 1,
        rules: [{ required: true }],
      },
      fieldProps: {
        options: secureList,
      },
    },
    {
      valueType: "textarea",
      dataIndex: "description",
      title: "描述",
      formItemProps: {
        rules: [{ required: true }],
      },
    },
  ];
  return (
    <MsModal
      {...modal.props}
      width={"50%"}
      onOk={() => {
        return formRef.validateFields().then((res) => {
          if (res.host === "smtp.163.com") {
            res.port = 465;
          } else {
            res.port = 465;
          }
          modal.resolve({ ...res });
          formRef.resetFields();
        });
      }}
      title="邮箱配置"
    >
      {/* 选择邮件模板信息 */}
      <Row style={{ marginBottom: "20px" }}>
        {tempList?.map((item) => (
          <Col
            className={styles?.tempMail}
            span={8}
            onClick={() => setTempId(item.id)}
          >
            <EmailModel color={item?.color} title={item?.title} />
            {/* 最底下的名称及绿点 */}
            <p
              style={item.id === tempId ? { color: item.color } : {}}
              className={styles.name}
            >
              {item.name}
            </p>
            {item.id === tempId && (
              <div
                className={styles.active}
                style={{ background: item.color }}
              ></div>
            )}
          </Col>
        ))}
      </Row>
      <WjForm
        // layout="vertical"
        form={formRef}
        formType="basic"
        noCard={true}
        formConfigList={columns}
      />
    </MsModal>
  );
});

export default Settings;
