import React from "react";
import "./styles/todo.scss";

const list = [
  {
    username: "查看今天工作内容",
    date: "上午 09:30",
    complate: true,
  },
  {
    username: "回复邮件",
    date: "上午 10:30",
    complate: true,
  },
  {
    username: "工作汇报整理",
    date: "上午 11:00",
    complate: true,
  },
  {
    username: "产品需求会议",
    date: "下午 02:00",
    complate: false,
  },
  {
    username: "整理会议内容",
    date: "下午 03:30",
    complate: false,
  },
  {
    username: "明天工作计划",
    date: "下午 06:30",
    complate: false,
  },
];
export default function TodoList() {
  return (
    <div className="region todo-list console-box box-width">
      <div className="card-header">
        <div className="title">
          <h4 className="custom-text box-title">代办事项</h4>
          <p className="custom-text subtitle">
            待处理<span>+6</span>
          </p>
        </div>
      </div>

      <div className="list">
        {list?.map((item, index) => (
          <div key={index}>
            <p className="title">{item.username}</p>
            <p className="date custom-text subtitle">{item.date}</p>
            {/* <el-checkbox v-model="item.complate" /> */}
          </div>
        ))}
      </div>
    </div>
  );
}
