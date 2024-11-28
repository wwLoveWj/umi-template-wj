import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Button,
  Flex,
  Row,
  Col,
  Popconfirm,
  Checkbox,
  Alert,
  Empty,
} from "antd";
import { AlertOutlined } from "@ant-design/icons";
import {
  TaskInfoQueryAPI,
  reminderTaskAPI,
  ReminderTaskDelAPI,
  reminderTimeTaskCancelAPI,
  reminderTimeTaskAPI,
  TaskListBatchDelAPI,
} from "@/service/api/task";
import NotificationModal from "./components/NotificationModal";
import { useRequest } from "ahooks";
import styles from "./style.less";
import { countDown } from "@/utils/time";
import dayjs from "dayjs";
import "./style.less";
import { MsModal } from "magical-antd-ui";
import classNames from "classnames";
import WjCheckBox from "@/components/WjCheckBox";
import SearchForm from "./components/SearchForm";

const IntervalUnit = new Map([
  ["second", "秒"],
  ["minute", "分钟"],
  ["hour", "小时"],
  ["day", "日"],
  ["week", "周"],
  ["month", "月"],
  ["year", "年"],
]);
const STATUS_TYPE = new Map([
  ["1", "completed"],
  ["0", "pendding"],
  ["2", "todoing"],
]);
// TODO:表单填写的校验和封装-------------------倒计时相关优化
const Index = () => {
  const [taskList, setTaskList] = useState<API.TaskListType[]>([]);
  const [taskIdList, setTaskIdList] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [isShowDelBtn, setIsShowDelBtn] = useState(true);
  const timeRef = useRef(null);
  // 请求任务卡片列表信息
  const queryQueryTaskInfo = useRequest(TaskInfoQueryAPI, {
    debounceWait: 100,
    onSuccess: (res: API.TaskListType[]) => {
      for (let i = 0; i < res.length; i++) {
        res[i].checked = false;
      }
      setTaskList([...res]);
    },
  });
  // 创建定时任务队列
  const reminderTimeTaskFn = useRequest(reminderTimeTaskAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: (res) => {
      debugger;
      queryQueryTaskInfo.run();
      // 语音提示用户任务
      // const utterThis = new window.SpeechSynthesisUtterance(taskDetails.task);
      // window.speechSynthesis.speak(utterThis);
    },
  });
  // 任务定时提醒接口
  const reminderTaskFn = useRequest(reminderTaskAPI, {
    manual: true,
    onSuccess: (res) => {
      debugger;
      if (res?.data?.userEmail?.length > 0) {
        reminderTimeTaskFn.run(res.data);
      }
    },
  });
  // 单个删除任务
  const deleteReminderTask = useRequest(
    (taskId: string) => ReminderTaskDelAPI({ taskId }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        queryQueryTaskInfo.run();
      },
    }
  );
  // 批量删除任务
  const batchDelTaskListFn = useRequest(TaskListBatchDelAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      setAllChecked(false);
      setTaskIdList([]);
      queryQueryTaskInfo.run();
    },
  });
  //   发送任务提醒
  const getReminderTime = (param: {
    userEmail: string;
    reminderContent?: string;
    reminderTime: string;
    taskId: string;
    task: string;
    reminderPattern: string;
    interval: string;
  }) => {
    debugger;
    reminderTaskFn.run({
      ...param,
      reminderContent: param?.task,
    });
  };

  // ===================================单选checkbox================================================
  const selectedTask = (index: number) => {
    let tmpUsers = [...taskList];
    tmpUsers[index].checked = !tmpUsers[index].checked;
    const arr = [...taskIdList];
    if (tmpUsers[index].checked) {
      arr.push(tmpUsers[index].taskId);
    } else {
      const i = arr.findIndex((taskId) => taskId === tmpUsers[index].taskId);
      arr.splice(i, 1);
    }
    setTaskIdList([...arr]);
    setTaskList([...tmpUsers]);
  };
  // 全选卡片checkbox
  const selectAllTasks = () => {
    setAllChecked(!allChecked);
    let tmpUsers = [...taskList];
    for (let i = 0; i < tmpUsers.length; i++) {
      tmpUsers[i].checked = !allChecked;
    }
    let arr: string[] = [];
    tmpUsers.map((item) => {
      if (item.checked) {
        arr.push(item.taskId);
      } else {
        const index = arr.findIndex((taskId) => taskId === item.taskId);
        arr.splice(index, 1);
      }
    });
    setTaskIdList([...arr]);
    setTaskList([...tmpUsers]);
  };
  // 开启关闭批量删除的按钮开关
  const onChangeSwitch = (checked: boolean) => {
    setIsShowDelBtn(checked);
  };
  // 查询任务
  const onSearchTask = (value: any) => {
    queryQueryTaskInfo.run(value);
  };
  // 当子级全选时勾选中全选按钮
  useEffect(() => {
    if (taskList?.length > 0 && taskList?.every((item) => item?.checked)) {
      setAllChecked(true);
    }
  }, [taskList]);
  return (
    <div className={styles.taskInfo}>
      <SearchForm taskList={taskList} onSearchTask={onSearchTask} />
      {taskList?.length > 0 && (
        <div
          style={{
            display: "flex",
            margin: "24px 12px 12px",
            justifyContent: "flex-end",
          }}
        >
          {isShowDelBtn && (
            <div className={styles.allSelected} style={{ flex: 4 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox checked={allChecked} onChange={selectAllTasks}>
                  全选
                </Checkbox>
                <Alert
                  message={`当前选中任务数：${taskIdList.length}项`}
                  type="info"
                  showIcon
                  banner={true}
                  style={{ width: "200px", color: "#1677ff" }}
                />
              </div>
              <Button
                danger
                type="primary"
                disabled={taskIdList.length === 0}
                onClick={() => batchDelTaskListFn.run({ taskIdList })}
              >
                批量删除
              </Button>
            </div>
          )}
          <div
            style={{
              justifyContent: "flex-end",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked
              onChange={onChangeSwitch}
            /> */}
            <WjCheckBox onChange={onChangeSwitch} />
          </div>
        </div>
      )}
      {taskList?.length > 0 ? (
        <Row
          gutter={[16, 12]}
          style={{ padding: "0 12px 12px", width: `calc(100% + 8px)` }}
        >
          {taskList.map((item, index) => {
            return (
              <Col
                span={8}
                key={item.taskId}
                onClick={() => selectedTask(index)}
              >
                <Card
                  className={styles.animateCard}
                  bodyStyle={{
                    padding: "18px 20px",
                    // #f8f9fa
                    background: item.checked
                      ? "orange"
                      : "var(--art-main-bg-color)",
                  }}
                  loading={queryQueryTaskInfo.loading}
                >
                  {/* <Checkbox
                  checked={item.checked}
                  onChange={() => selectedTask(index)}
                /> */}
                  <Flex wrap gap="small" vertical>
                    <div className={styles.taskHeader}>
                      <div>
                        <div className={styles.task}>
                          <h3
                            style={{ color: "#0080f6" }}
                            className="custom-text"
                          >
                            Task：
                          </h3>
                          <h3
                            style={{
                              color: item.checked ? "#fff" : `#000`,
                            }}
                          >
                            {item.task}
                          </h3>
                        </div>
                        <p
                          style={{
                            color:
                              STATUS_TYPE.get(item.status) === "completed"
                                ? "#44b06c"
                                : Number(item.status) === 0
                                ? "#ffc045"
                                : "yellow",
                          }}
                        >
                          状态：{STATUS_TYPE.get(item.status)}
                        </p>
                      </div>
                      <div
                        ref={timeRef}
                        className={classNames(
                          styles.reminderTime,
                          "custom-text"
                        )}
                        style={
                          item.reminderTime && Number(item.status) === 0
                            ? { animation: `colorChg 1.5s infinite` }
                            : {}
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          // 调出时间设置弹窗
                          MsModal.open(NotificationModal).then((res: any) => {
                            getReminderTime({
                              ...item,
                              ...res,
                            });
                          });
                        }}
                      >
                        <AlertOutlined />
                        <span
                          style={{
                            fontSize: "12px",
                            color: item.checked ? "#fff" : "#8a8a8a",
                            marginTop: "8px",
                          }}
                        >
                          设置提醒
                        </span>
                      </div>
                    </div>
                    <div className={styles.times}>
                      <p style={{ color: item.checked ? "#fff" : "#92999f" }}>
                        创建时间：
                        {dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}
                      </p>
                      {item.reminderTime &&
                        item.reminderPattern !== "intervalTime" && (
                          <p
                            style={{
                              color: item.checked ? "#fff" : "#92999f",
                            }}
                          >
                            提醒时间：
                            {dayjs(item.reminderTime).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </p>
                        )}
                      {item.reminderTime &&
                        item.reminderPattern === "intervalTime" && (
                          <p>
                            提醒间隔：
                            <span style={{ color: "green" }}>
                              {item.reminderTime}{" "}
                              {IntervalUnit.get(item.intervalUnit)}
                            </span>
                          </p>
                        )}
                    </div>
                    <div className={styles.delBtn}>
                      <span onClick={(e) => e.stopPropagation()}>
                        <Popconfirm
                          title={`确定要删除【${item.task}】任务吗？`}
                          placement="topLeft"
                          onConfirm={() => {
                            deleteReminderTask.run(item.taskId);
                          }}
                        >
                          <Button type="primary" danger>
                            删除
                          </Button>
                        </Popconfirm>
                      </span>
                      {item.reminderTime &&
                        Number(item.status) === 0 &&
                        item.reminderPattern !== "intervalTime" && (
                          <div className={styles.countDown}>
                            倒计时：
                            <p id={`${item.taskId}`}>
                              {countDown(
                                item.taskId,
                                item.reminderTime,
                                Number(item.status)
                              )}
                            </p>
                          </div>
                        )}
                    </div>
                  </Flex>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className={styles.emptyCard}>
          <Empty description="暂无待办事项" />
        </div>
      )}
    </div>
  );
};

export default Index;
