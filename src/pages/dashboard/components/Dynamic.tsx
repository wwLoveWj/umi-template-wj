import React from "react";
import "./styles/dynamic.scss";
const list = [
  {
    username: "中小鱼",
    type: "关注了",
    target: "誶誶淰",
  },
  {
    username: "何小荷",
    type: "发表文章",
    target: "Vue3 + Typescript + Vite 项目实战笔记",
  },
  {
    username: "誶誶淰",
    type: "提出问题",
    target: "主题可以配置吗",
  },
  {
    username: "发呆草",
    type: "兑换了物品",
    target: "《奇特的一生》",
  },
  {
    username: "甜筒",
    type: "关闭了问题",
    target: "发呆草",
  },
  {
    username: "冷月呆呆",
    type: "兑换了物品",
    target: "《高效人士的七个习惯》",
  },
];
export default function Dynamic() {
  return (
    <div className="region dynamic console-box">
      <div className="card-header">
        <div className="title">
          <h4 className="custom-text box-title">动态</h4>
          <p className="custom-text subtitle">
            新增<span>+6</span>
          </p>
        </div>
      </div>

      <div className="list">
        {list?.map((item, index) => (
          <div key={index}>
            <span className="user">{item.username}</span>
            <span className="type">{item.type}</span>
            <span className="target">{item.target}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
