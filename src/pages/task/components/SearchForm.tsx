import React, { useState } from "react";
import { Row, Col, Input, DatePicker, Select, Form } from "antd";
import { AudioOutlined } from "@ant-design/icons";
// import type { SearchProps } from "antd/es/input/Search";
import { disabledDate, disabledRangeTime } from "@/utils/time";
import { guid } from "@/utils";
import { ReminderTaskcreateAPI } from "@/service/api/task";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import styles from "../style.less";
const { RangePicker } = DatePicker;
const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);
export default function SearchForm({
  onSearchTask,
  taskList,
}: {
  onSearchTask: (params: any) => void;
  taskList: API.TaskListType[];
}) {
  const [taskName, setTaskName] = useState("");
  const [form] = Form.useForm();
  // 查询任务
  const handleSearchTask = (value: any) => {
    onSearchTask(value);
  };

  //   创建任务信息卡片
  const createReminderTask = useRequest(
    (task: string) =>
      ReminderTaskcreateAPI({ task, taskId: guid(), status: 2 }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        form.resetFields();
        onSearchTask({});
      },
    }
  );
  //   创建任务
  const onSearch = (value: string) => {
    form.validateFields().then(() => {
      createReminderTask.run(value);
    });
  };
  return (
    <>
      <Row style={{ padding: "12px 12px 0" }} gutter={[16, 12]}>
        <Col span={8}>
          <Search
            placeholder="请输入你想查询的任务名称..."
            enterButton
            value={taskName}
            onSearch={(e) => handleSearchTask({ taskName: e })}
            onChange={(e) => {
              let value = e.target.value;
              setTaskName(value);
            }}
            allowClear
          />
        </Col>
        {/* TODO:查询有点问题不知道咋写 */}
        <Col span={8}>
          <RangePicker
            disabledDate={disabledDate}
            disabledTime={disabledRangeTime}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [
                dayjs("00:00:00", "HH:mm:ss"),
                dayjs("11:59:59", "HH:mm:ss"),
              ],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Col>
        <Col span={8}>
          <Select
            showSearch
            placeholder="请选择任务状态"
            optionFilterProp="children"
            onChange={(e) => handleSearchTask({ taskStatus: e })}
            defaultValue={"2"}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: "100%" }}
            options={[
              {
                value: "0",
                label: "pendding",
              },
              {
                value: "1",
                label: "completed",
              },
              {
                value: "2",
                label: "todoing",
              },
            ]}
          />
        </Col>
      </Row>
      <div className={styles.completedTotal}>
        <span>{`已完成：${
          taskList.filter((item) => Number(item.status) === 1)?.length
        }条`}</span>
        <span>{`未完成：${
          taskList.filter((item) => Number(item.status) !== 1)?.length
        }条`}</span>
      </div>
      <Form
        name="basic"
        form={form}
        autoComplete="off"
        className={styles.searchForm}
      >
        <Form.Item
          name="task"
          rules={[{ required: true, message: "请输入您想创建的任务..." }]}
        >
          <Search
            placeholder="创建任务提醒"
            enterButton="Add"
            size="large"
            className={styles.createTask}
            suffix={suffix}
            onSearch={onSearch}
          />
        </Form.Item>
      </Form>
    </>
  );
}
