import React, { useState } from "react";
import { randomColor } from "@/utils/color";
import { Drawer } from "antd";
import { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import "../style.less";
import CommentWidget from "./CommentWidget";

const commentList = [
  {
    id: 1,
    date: "2024-9-3",
    content: "发现了一个超级好用的工具，开心",
    collection: 5,
    comment: 8,
    userName: "匿名",
  },
  {
    id: 2,
    date: "2024-9-3",
    content: "今天的代码写得很顺利！",
    collection: 3,
    comment: 2,
    userName: "Coder123",
  },
  {
    id: 3,
    date: "2024-9-4",
    content: "遇到个bug，调试了一整天",
    collection: 7,
    comment: 10,
    userName: "DebugMaster",
  },
  {
    id: 4,
    date: "2024-9-4",
    content: "学Node真的是一件很有趣的事",
    collection: 9,
    comment: 4,
    userName: "NodeLover",
  },
  {
    id: 5,
    date: "2024-9-5",
    content: "今天的进度有点慢，需要加把劲了",
    collection: 2,
    comment: 3,
    userName: "努力中的小白",
  },
  {
    id: 6,
    date: "2024-9-5",
    content: "太好了，终于解决了一个难题！",
    collection: 11,
    comment: 5,
    userName: "匿名",
  },
  {
    id: 7,
    date: "2024-9-6",
    content: "学会了新的Node技巧，开心！",
    collection: 4,
    comment: 7,
    userName: "开心每一天",
  },
  {
    id: 8,
    date: "2024-9-6",
    content: "代码优化真的是一个细致活",
    collection: 6,
    comment: 4,
    userName: "精益求精",
  },
  {
    id: 9,
    date: "2024-9-7",
    content: "今天的工作太顺利了，完美！",
    collection: 10,
    comment: 9,
    userName: "完美主义者",
  },
  {
    id: 10,
    date: "2024-9-7",
    content: "需要多练习，才能掌握更多技能",
    collection: 5,
    comment: 6,
    userName: "匿名",
  },
  {
    id: 11,
    date: "2024-9-8",
    content: "每天进步一点点，终会成功",
    collection: 8,
    comment: 7,
    userName: "逐梦者",
  },
  {
    id: 12,
    date: "2024-9-8",
    content: "与其抱怨，不如努力改变",
    collection: 12,
    comment: 10,
    userName: "改变命运",
  },
  {
    id: 13,
    date: "2024-9-9",
    content: "今天尝试了新的库，感觉不错",
    collection: 9,
    comment: 8,
    userName: "新手尝试",
  },
  {
    id: 14,
    date: "2024-9-9",
    content: "写代码也需要灵感，今天灵感不错",
    collection: 6,
    comment: 5,
    userName: "灵感源泉",
  },
];
export default function Comment() {
  const [open, setOpen] = useState(false);
  const [clickItem, setClickItem] = useState({
    id: 1,
    date: "2024-9-3",
    content: "加油！学好Node 自己写个小Demo",
    collection: 5,
    comment: 8,
    userName: "匿名",
  });
  const openDrawer = (params) => {
    setOpen(true);
    setClickItem(params);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <div className="page-content">
      <h1 className="title">留言墙</h1>
      <p className="desc">
        每一份留言都记录了您的想法，也为我们提供了珍贵的回忆
      </p>

      <div className="list">
        <ul className="offset">
          {commentList?.map((item) => (
            <li
              className="comment-box"
              key={item.id}
              style={{ background: randomColor() }}
              onClick={() => openDrawer(item)}
            >
              <p className="custom-text date">{item.date}</p>
              <p className="custom-text content">{item.content}</p>
              <div className="bottom custom-text">
                <div className="left">
                  <div className="drawer-open custom-text">
                    <LikeOutlined />
                    {item.collection}
                  </div>
                  <div className="drawer-open custom-text">
                    <MessageOutlined />
                    {item.comment}
                  </div>
                </div>
                <div className="right">
                  <div>{item.userName}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Drawer title="详情" placement="right" onClose={onClose} open={open}>
        <div className="drawer-default">
          <div className="comment-box" style={{ background: randomColor() }}>
            <p className="custom-text date">{clickItem.date}</p>
            <p className="custom-text content">{clickItem.content}</p>
            <div className="bottom">
              <div className="left">
                <div className="drawer-open custom-text">
                  <LikeOutlined />
                  {clickItem.collection}
                </div>
                <div className="drawer-open custom-text">
                  <MessageOutlined />
                  {clickItem.comment}
                </div>
              </div>
              <div className="right">
                <div>{clickItem.userName}</div>
              </div>
            </div>
          </div>

          {/* 评论组件 */}
          <CommentWidget></CommentWidget>
        </div>
      </Drawer>
    </div>
  );
}
