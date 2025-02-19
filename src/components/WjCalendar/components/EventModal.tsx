import React from "react";
import { Form } from "antd";
import { reminderTaskAPI, reminderTimeTaskAPI } from "@/service/api/task";
import { useRequest } from "ahooks";
import { MsModal } from "magical-antd-ui";
import { WjForm } from "@/components/WjForm";
import dayjs from "dayjs";
import { guid } from "@/utils";

const eventTypes = [
  { label: "基本", value: "processing" },
  { label: "成功", value: "success" },
  { label: "警告", value: "warning" },
  { label: "危险", value: "error" },
] as const;

const MyModal = MsModal.create(
  ({ editInfo }: { editInfo: API.CalendarEvent }) => {
    const modal = MsModal.useModal();
    const [formRef] = Form.useForm();
    const isEditMode = !!editInfo?.calendarId;

    const columns: any[] = [
      {
        dataIndex: "content",
        title: "活动标题",
        search: true,
        formItemProps: {
          rules: [{ required: true }],
        },
        fieldProps: {
          placeholder: "请输入活动标题",
        },
      },
      {
        dataIndex: "type",
        search: true,
        valueType: "radio",
        title: "事件颜色",
        formItemProps: {
          initialValue: "processing",
          rules: [{ required: true }],
        },
        fieldProps: {
          options: eventTypes,
          placeholder: "请选择事件颜色",
        },
      },
      {
        valueType: "date",
        search: true,
        dataIndex: "startDate",
        title: "开始日期",
        formItemProps: {
          rules: [{ required: true }],
        },
        fieldProps: {
          format: "YYYY-MM-DD",
          placeholder: "请选择开始日期",
        },
      },
      {
        valueType: "date",
        search: true,
        dataIndex: "endDate",
        title: "结束日期",
        fieldProps: {
          format: "YYYY-MM-DD",
          placeholder: "选择结束日期",
        },
      },
    ];
    return (
      <MsModal
        {...modal.props}
        title={"添加事件"}
        onOk={() => {
          return formRef?.validateFields().then((res) => {
            const startDate = dayjs(res.startDate).format("YYYY-MM-DD");
            const endDate = dayjs(res.endDate).format("YYYY-MM-DD");
            const params = {
              ...res,
              startDate,
              endDate,
              calendarId: isEditMode ? editInfo?.calendarId : guid(),
            };
            modal.resolve(params);
          });
        }}
      >
        <WjForm
          initialValues={editInfo}
          form={formRef}
          formType="basic"
          noCard={true}
          formConfigList={columns?.filter((item) => item?.search)}
        />
      </MsModal>
    );
  }
);

export default MyModal;
