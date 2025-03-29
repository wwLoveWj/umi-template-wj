import { MsModal } from "magical-antd-ui";
import React from "react";
// import type { DatePickerProps, TimePickerProps } from "antd";
import {
  DatePicker,
  Form,
  Select,
  Switch,
  Input,
  TimePicker,
  Row,
  Col,
} from "antd";
import { useRequest } from "ahooks";
import { UserInfoQueryAPI } from "@/service/api/user";
import { CreateTODONoticeAPI } from "@/service/api/task";
// import { disabledTime, disabledDate } from "@/utils/time";
// import CustomFormItem from "@/components/CustomFormItem";
// import { storage } from "@/utils/storage";
import dayjs from "dayjs";

// 触发频率
const frequencyOptions: { value: number; label: string }[] = Array.from(
  { length: 31 },
  (_, index) => {
    return { value: index + 1, label: `每${index + 1}` }; // 每一项的内容可以根据需要自定义
  }
);
const frequencyMonthOptions: { value: number; label: string }[] = Array.from(
  { length: 31 },
  (_, index) => {
    return { value: index + 1, label: `${index + 1}日` };
  }
);
const frequencyWeekOptions: { value: number; label: string }[] = [
  "星期天",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
]?.map((item, index) => {
  return { value: index, label: item };
});
const { TextArea } = Input;
// interface TimeType {
//   dayOfWeek: number;
//   month: number;
//   day: number;
//   hour: number;
//   minute: number;
//   second: number;
// }
const { Option } = Select;
const NoticeModal = MsModal.create(() => {
  //   const loginInfo = storage.get("login-info");
  const [noticeMode, setNoticeMode] = React.useState("frequencyMode");
  const [frequencyType, setFrequencyType] = React.useState("day");

  const modal = MsModal.useModal();
  const [form] = Form.useForm();
  // 搜索用户下拉select
  const filterOption = (
    input: string,
    option?: { username: string; email: string }
  ) => (option?.username ?? "").toLowerCase().includes(input.toLowerCase());
  /**
   * 查询用户信息接口
   */
  const { data: userEmailList } = useRequest(UserInfoQueryAPI, {
    debounceWait: 100,
  });
  // 创建代办通知接口
  const createTODONoticeSubmit = useRequest(CreateTODONoticeAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: (res) => {
      debugger;
      modal.resolve();
      form.resetFields();
    },
  });
  return (
    <MsModal
      width={"45%"}
      {...modal.props}
      title={"新建待办通知"}
      onOk={() => {
        return form.validateFields().then((res) => {
          const { endTime, startTime, noticeTime } = res;
          let params = {
            ...res,
            endTime: dayjs(endTime).format("YYYY-MM-DD"),
            startTime: dayjs(startTime).format("YYYY-MM-DD"),
            noticeTime: dayjs(noticeTime).format("HH:mm"),
          };
          debugger;
          createTODONoticeSubmit.run(params);
        });
      }}
    >
      <Form
        name="modal"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        autoComplete="off"
        initialValues={{ noticeTitle: "通知模板" }}
      >
        <Form.Item
          label="通知名称"
          name="noticeTitle"
          rules={[{ required: true, message: "请选择您的通知名称！" }]}
        >
          <Input placeholder="请输入通知名称" />
        </Form.Item>
        <Form.Item
          label="通知人"
          name="noticeEmail"
          rules={[{ required: true, message: "请选择您的提醒人邮箱！" }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="请选择您的提醒人邮箱"
            options={userEmailList}
            filterOption={filterOption}
            fieldNames={{ label: "username", value: "email" }}
          />
        </Form.Item>
        <Form.Item
          label="通知内容"
          name="noticeContent"
          rules={[{ required: true, message: "请输入您想提醒内容..." }]}
        >
          <TextArea
            placeholder="请输入您想创建的任务提醒内容..."
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item
          label="通知模式"
          name="noticeMode"
          initialValue={"frequencyMode"}
          rules={[{ required: true, message: "请选择您的定时模式！" }]}
        >
          <Select
            onChange={(e) => {
              setNoticeMode(e);
            }}
          >
            <Option value="fixedDate">固定日期</Option>
            <Option value="fixedTime">固定时间</Option>
            <Option value="frequencyMode">重复提醒</Option>
          </Select>
        </Form.Item>
        {noticeMode === "fixedTime" && (
          <Form.Item
            label="通知时间"
            name="noticeTime"
            rules={[{ required: true, message: "请选择您需要提醒的时间！" }]}
          >
            <TimePicker
              // defaultValue={dayjs("12:00", "HH:mm")}
              placeholder="请选择通知时间"
              format={"HH:mm"}
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
        {noticeMode === "frequencyMode" && (
          <>
            <Form.Item
              label="通知时间"
              name="noticeTime"
              rules={[{ required: true, message: "请选择您需要提醒的时间！" }]}
            >
              <TimePicker
                // defaultValue={dayjs("12:00", "HH:mm")}
                placeholder="请选择通知时间"
                format={"HH:mm"}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="重复频率"
              rules={[{ required: true, message: "请选择重复频率！" }]}
            >
              <Form.List
                name="frequencyConfig"
                initialValue={[{ frequencyNum: 1, frequencyType: "day" }]}
              >
                {(fields, { add, remove }) => (
                  <div style={{ width: "100%" }}>
                    {fields.map((field) => (
                      <Row key={field.key}>
                        <Col
                          span={
                            ["week", "month"]?.includes(frequencyType) ? 8 : 12
                          }
                        >
                          <Form.Item
                            noStyle
                            name={[field.name, "frequencyNum"]}
                          >
                            <Select
                              options={frequencyOptions}
                              style={{ width: "100%" }}
                            ></Select>
                          </Form.Item>
                        </Col>
                        <Col
                          span={
                            ["week", "month"]?.includes(frequencyType) ? 8 : 12
                          }
                        >
                          <Form.Item
                            noStyle
                            name={[field.name, "frequencyType"]}
                          >
                            <Select
                              style={{ width: "100%" }}
                              onChange={(e) => {
                                setFrequencyType(e);
                                form.setFieldValue("frequencyConfig", [
                                  {
                                    frequencyWeek: 1,
                                    frequencyType: e,
                                    frequencyNum:
                                      form.getFieldValue("frequencyConfig")[0]
                                        ?.frequencyNum,
                                  },
                                ]);
                              }}
                            >
                              {/* <Option value="second">秒</Option>
                              <Option value="minute">分</Option>
                              <Option value="hour">时</Option> */}
                              <Option value="day">天</Option>
                              <Option value="week">周</Option>
                              <Option value="month">月</Option>
                              {/* <Option value="year">年</Option> */}
                            </Select>
                          </Form.Item>
                        </Col>
                        {["week", "month"]?.includes(frequencyType) && (
                          <Col span={8}>
                            <Form.Item
                              noStyle
                              name={[field.name, "frequencyWeek"]}
                            >
                              <Select
                                options={
                                  frequencyType === "week"
                                    ? frequencyWeekOptions
                                    : frequencyMonthOptions
                                }
                                style={{ width: "100%" }}
                                placeholder={
                                  frequencyType === "week"
                                    ? "请选择一周中的某天"
                                    : "请选择一月中的某天"
                                }
                              ></Select>
                            </Form.Item>
                          </Col>
                        )}
                      </Row>
                    ))}
                  </div>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item
              label="重复开始时间"
              name="startTime"
              rules={[{ required: true, message: "请选择开始时间！" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="请选择开始时间"
              />
            </Form.Item>
            <Form.Item
              label="重复截止时间"
              name="endTime"
              //   rules={[{ required: true, message: "请选择截止时间！" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="请选择截止时间"
              />
            </Form.Item>
          </>
        )}
      </Form>
    </MsModal>
  );
});

export default NoticeModal;
