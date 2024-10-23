import React from "react";
import { Form } from "antd";
import { reminderTaskAPI, reminderTimeTaskAPI } from "@/service/api/task";
import { useRequest } from "ahooks";
import { MsModal } from "magical-antd-ui";
import { WjForm } from "@/components/WjForm";

const MyModal = MsModal.create(() => {
  debugger;
  const modal = MsModal.useModal();
  const [formRef] = Form.useForm();
  // 创建定时任务队列
  const reminderTimeTaskFn = useRequest(
    (params: {
      userEmail: string;
      reminderContent: string;
      reminderTime: string;
      taskId: string;
      reminderPattern: string;
      interval: string;
    }) => reminderTimeTaskAPI(params),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        // TODO: 查询列表更新信息
        // 语音提示用户任务
        // const utterThis = new window.SpeechSynthesisUtterance(taskDetails.task);
        // window.speechSynthesis.speak(utterThis);
      },
    }
  );
  // 任务定时提醒接口
  const reminderTaskFn = useRequest(
    (params: {
      userEmail: string;
      reminderContent: string;
      reminderTime: string;
      taskId: string;
      reminderPattern: string;
      interval: string;
    }) => reminderTaskAPI(params),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: (res) => {
        if (res) {
          reminderTimeTaskFn.run(res.data);
        }
        // TODO: 查询列表更新信息
      },
    }
  );
  const columns: any[] = [
    {
      dataIndex: "taskName",
      title: "待办事项",
      search: true,
      formItemProps: {
        rules: [{ required: true }],
      },
      fieldProps: {
        // placeholder: "请输入待办事项",
      },
    },
    {
      dataIndex: "email",
      search: true,
      title: "通知人邮箱",
      formItemProps: {
        rules: [{ required: true, message: "请填写通知人邮箱" }],
      },
      fieldProps: {
        placeholder: "请填写通知人邮箱",
      },
    },
    {
      valueType: "date",
      search: true,
      dataIndex: "notifyTime",
      title: "通知时间",
      formItemProps: {
        rules: [{ required: true }],
      },
      fieldProps: {
        // placeholder: "请选择通知时间",
      },
    },
    {
      valueType: "textarea",
      search: true,
      dataIndex: "description",
      title: "描述",
    },
  ];
  return (
    <MsModal
      {...modal.props}
      title={"弹窗标题"}
      onOk={() => {
        return formRef?.validateFields().then((res) => {
          debugger;
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
