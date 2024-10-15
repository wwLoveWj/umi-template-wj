import { MsModal } from "magical-antd-ui";
import React, { useState } from "react";
import type { DatePickerProps, TimePickerProps } from "antd";
import { DatePicker, Form, Button, Select, TimePicker, Input } from "antd";
import { useRequest } from "ahooks";
import { UserInfoQueryAPI } from "@/service/api/user";
import { disabledTime, disabledDate } from "@/utils/time";

const { Option } = Select;
const MyModal = MsModal.create(
  ({ getReminderTime }: { getReminderTime: (param: any) => void }) => {
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

    const onOk = (value: DatePickerProps["value"]) => {
      console.log("onOk: ", value);
    };
    // 设置提醒时间接口的参数
    const onFinish = () => {
      form.validateFields().then((res) => {
        getReminderTime({
          reminderTime: res.reminderTime,
          userEmail: res.userEmail,
          reminderPattern: res.reminderPattern,
          interval,
        });
        form.resetFields();
      });
      modal.close();
    };
    return (
      <MsModal {...modal.props} title={"提醒时间111"}>
        <Form
          name="modal"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ reminderPattern: "fixedDate" }}
        >
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
              <Option value="fixedTime">固定时间</Option>
              <Option value="intervalTime">间隔时间</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="提醒时间"
            name="reminderTime"
            rules={[{ required: true, message: "请选择您需要提醒的时间！" }]}
          >
            {time === "intervalTime" ? (
              <Input addonAfter={selectBefore} />
            ) : time === "fixedDate" ? (
              <DatePicker
                showTime
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                onOk={onOk}
                style={{ width: "100%" }}
              />
            ) : (
              <TimePicker />
            )}
          </Form.Item>
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
        </Form>
      </MsModal>
    );
  }
);

export default MyModal;
