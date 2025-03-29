import { MsModal } from "magical-antd-ui";
import React, { useState } from "react";
// import type { DatePickerProps, TimePickerProps } from "antd";
import { DatePicker, Form, Select, Input } from "antd";
import { useRequest } from "ahooks";
import { UserInfoQueryAPI } from "@/service/api/user";
import { disabledTime, disabledDate } from "@/utils/time";
import CustomFormItem from "@/components/CustomFormItem";
import TimeInput from "./TimeInput";
import { storage } from "@/utils/storage";

const { TextArea } = Input;
interface TimeType {
  dayOfWeek: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
const { Option } = Select;
const MyModal = MsModal.create(() => {
  const loginInfo = storage.get("login-info");
  const modal = MsModal.useModal();
  const [form] = Form.useForm();
  // const [type, setType] = useState<PickerType>("time");
  const [time, setTime] = useState("fixedDate"); //提醒的时间类型
  const [interval, setInterval] = useState("second");
  // 时间选择器的前缀
  const selectBefore = (
    <Select value={interval} onChange={setInterval}>
      <Option value="second">秒</Option>
      <Option value="minute">分钟</Option>
      <Option value="hour">小时</Option>
      <Option value="day">天</Option>
      <Option value="week">周</Option>
      <Option value="month">月</Option>
      <Option value="year">年</Option>
    </Select>
  );

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

  return (
    <MsModal
      width={"45%"}
      {...modal.props}
      title={"提醒时间"}
      onOk={() => {
        return form.validateFields().then((res) => {
          if (res?.reminderPattern === "fixedTime") {
            const timeS: TimeType = res.reminderTime[0];
            res.reminderTime = [
              timeS?.second,
              timeS?.minute,
              timeS?.hour,
              timeS?.day,
              timeS?.month,
              timeS?.dayOfWeek,
            ]?.join(" ");
            // res.reminderTime = cornTime?.replace(/0/g, "*");
          } else if (res?.reminderPattern === "everyDay") {
            //  Object.keys(res.reminderTime[0]);
            const obj = res.reminderTime[0];
            for (const key in obj) {
              if (obj[key] === "*") {
                Reflect.deleteProperty(obj, key);
              }
            }
            res.reminderTime = res.reminderTime[0];
          }
          modal.resolve({ ...res, interval, sendEmail: loginInfo?.email });
          form.resetFields();
        });
      }}
    >
      <Form
        name="modal"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        autoComplete="off"
        initialValues={{ reminderPattern: "fixedDate" }}
      >
        {/* cron规则 */}
        {/* https://crontab.guru/monday-to-friday */}
        <Form.Item
          label="定时模式"
          name="reminderPattern"
          rules={[{ required: true, message: "请选择您的定时模式！" }]}
        >
          {/* <Select value={type} onChange={setType}>
                <Option value="time">Time</Option>
                <Option value="date">Date</Option>
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
                <Option value="quarter">Quarter</Option>
                <Option value="year">Year</Option>
                <Option value="interval">Interval</Option>
              </Select> */}
          <Select
            value={time}
            onChange={(e) => {
              setTime(e);
              // form.setFieldValue("reminderTime", "");
            }}
          >
            <Option value="fixedDate">固定日期</Option>
            <Option value="fixedTime">cron规则</Option>
            <Option value="everyDay">固定时间</Option>
            <Option value="intervalTime">间隔时间</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="提醒时间"
          name="reminderTime"
          rules={[{ required: true, message: "请选择您需要提醒的时间！" }]}
        >
          {time === "intervalTime" ? (
            <Input addonAfter={selectBefore} addonBefore="每" />
          ) : time === "fixedDate" ? (
            <DatePicker
              showTime
              disabledDate={disabledDate}
              disabledTime={disabledTime}
              style={{ width: "100%" }}
            />
          ) : (
            <CustomFormItem>
              {({ onChange, value }) => (
                <TimeInput
                  value={value}
                  onChange={(e) => {
                    if (onChange) onChange(e);
                  }}
                />
              )}
            </CustomFormItem>
          )}
        </Form.Item>
        {form.getFieldValue("reminderPattern") === "fixedTime" && (
          <>
            <Form.Item
              label="开始时间"
              name="startTime"
              rules={[{ required: true, message: "请选择开始时间！" }]}
            >
              <DatePicker
                showTime
                style={{ width: "100%" }}
                placeholder="请选择开始时间"
              />
            </Form.Item>
            <Form.Item
              label="截止时间"
              name="endTime"
              rules={[{ required: true, message: "请选择截止时间！" }]}
            >
              <DatePicker
                showTime
                style={{ width: "100%" }}
                placeholder="请选择截止时间"
              />
            </Form.Item>
          </>
        )}
        <Form.Item
          label="提醒邮箱"
          name="userEmail"
          rules={[{ required: true, message: "请选择您的提醒人邮箱..." }]}
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
          label="提醒内容"
          name="desc"
          rules={[
            { required: true, message: "请输入您想创建的任务提醒内容..." },
          ]}
        >
          <TextArea
            placeholder="请输入您想创建的任务提醒内容..."
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </MsModal>
  );
});

export default MyModal;
