import React from "react";
import { Form } from "antd";
import { createLinkCardListAPI } from "@/service/api/link";
import { useRequest } from "ahooks";
import { MsModal } from "magical-antd-ui";
import { WjForm } from "@/components/WjForm";

const MyModal = MsModal.create(() => {
  const modal = MsModal.useModal();
  const [formRef] = Form.useForm();

  //   <Form.Item name="avatar" label="头像">
  //     <UploadImage
  //       getImgUrl={({ data }: { data: { url: string } }) => {
  //         // 获取到上传图片后得到的响应信息
  //         form.setFieldValue("avatar", data.url);
  //       }}
  //     />
  //   </Form.Item>
  const columns: any[] = [
    {
      dataIndex: "link",
      title: "网址",
      search: true,
      formItemProps: {
        rules: [{ required: true }],
      },
      fieldProps: {
        placeholder: "请输入网址",
      },
    },
    {
      dataIndex: "name",
      title: "网址名",
      search: true,
      formItemProps: {
        rules: [{ required: true }],
      },
      fieldProps: {
        placeholder: "请输入网址名",
      },
    },
    {
      valueType: "textarea",
      search: true,
      dataIndex: "description",
      title: "描述",
      formItemProps: {
        rules: [{ required: true }],
      },
      fieldProps: {
        placeholder: "请输入描述",
        showCount: true,
        maxLength: 100,
      },
    },
  ];
  const { runAsync } = useRequest(createLinkCardListAPI, {
    manual: true,
  });
  return (
    <MsModal
      {...modal.props}
      title={"添加网址"}
      onOk={() => {
        return formRef?.validateFields().then(async (res) => {
          await runAsync(res);
          modal.resolve(res);
        });
      }}
    >
      <WjForm
        form={formRef}
        formType="basic"
        noCard={true}
        formConfigList={columns?.filter((item) => item?.search)}
      />
    </MsModal>
  );
});

export default MyModal;
