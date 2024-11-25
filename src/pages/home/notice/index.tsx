import React, { useState } from "react";
import { Tabs } from "antd";
import { SystemMainColor, hexToRgba, getCssVariable } from "@/utils/color";
import "./style.less";
import {
  MutedOutlined,
  MailOutlined,
  HeartOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import avatar1 from "@/assets/imgs/avatar/avatar1.jpg";
import avatar2 from "@/assets/imgs/avatar/avatar2.jpg";
import avatar3 from "@/assets/imgs/avatar/avatar3.jpg";
import avatar4 from "@/assets/imgs/avatar/avatar4.jpg";
import avatar5 from "@/assets/imgs/avatar/avatar5.jpg";
import avatar6 from "@/assets/imgs/avatar/avatar6.jpg";

const noticeStyleMap = {
  email: {
    icon: <MailOutlined />,
    iconColor: "var(--art-warning)",
    backgroundColor: "--art-warning",
  },
  message: {
    icon: <MutedOutlined />,
    iconColor: "var(--art-success)",
    backgroundColor: "--art-success",
  },
  collection: {
    icon: <HeartOutlined />,
    iconColor: "var(--art-danger)",
    backgroundColor: "--art-danger",
  },
  user: {
    icon: <UserOutlined />,
    iconColor: "var(--art-info)",
    backgroundColor: "--art-info",
  },
  notice: {
    icon: <BellOutlined />,
    iconColor: "var(--art-primary)",
    backgroundColor: "--art-primary",
  },
};
const noticeList = [
  {
    title: "新增国际化",
    time: "2024-6-13 0:10",
    type: "notice",
  },
  {
    title: "冷月呆呆给你发了一条消息",
    time: "2024-4-21 8:05",
    type: "message",
  },
  {
    title: "小肥猪关注了你",
    time: "2020-3-17 21:12",
    type: "collection",
  },
  {
    title: "新增使用文档",
    time: "2024-02-14 0:20",
    type: "notice",
  },
  {
    title: "小肥猪给你发了一封邮件",
    time: "2024-1-20 0:15",
    type: "email",
  },
  {
    title: "菜单mock本地真实数据",
    time: "2024-1-17 22:06",
    type: "notice",
  },
];
const msgList: any = [
  {
    title: "池不胖 关注了你",
    time: "2021-2-26 23:50",
    avatar: avatar1,
  },
  {
    title: "唐不苦 关注了你",
    time: "2021-2-21 8:05",
    avatar: avatar2,
  },
  {
    title: "中小鱼 关注了你",
    time: "2020-1-17 21:12",
    avatar: avatar3,
  },
  {
    title: "何小荷 关注了你",
    time: "2021-01-14 0:20",
    avatar: avatar4,
  },
  {
    title: "誶誶淰 关注了你",
    time: "2020-12-20 0:15",
    avatar: avatar5,
  },
  {
    title: "冷月呆呆 关注了你",
    time: "2020-12-17 22:06",
    avatar: avatar6,
  },
];
const pendingList = [{ title: "记得吃饭", time: "2024/11/05 12:30" }];
const Index = ({ show }: { show: boolean }) => {
  //   const [noticeList] = useState<any[]>([]);

  const onChange = (key: string) => {
    console.log(key);
  };

  const getRandomColor = () => {
    const index = Math.floor(Math.random() * SystemMainColor.length);
    return SystemMainColor[index];
  };
  const getNoticeStyle = (type: string) => {
    const defaultStyle = {
      icon: "\ue747",
      iconColor: "#FFFFFF",
      backgroundColor: getRandomColor(),
    };

    const style =
      noticeStyleMap[type as keyof typeof noticeStyleMap] || defaultStyle;

    return {
      ...style,
      backgroundColor:
        style.backgroundColor !== defaultStyle.backgroundColor
          ? hexToRgba(getCssVariable(style.backgroundColor), 0.13).rgba
          : style.backgroundColor,
    };
  };
  return (
    <div
      className="notice"
      style={{
        transform: show ? "scaleY(1)" : "scaleY(0.9)",
        display: show ? "block" : "none",
      }}
    >
      <div className="header">
        <span className="text">通知</span>
        <span className="read-btn">标为已读</span>
      </div>
      <div className="content">
        <div className="scroll">
          <Tabs
            defaultActiveKey="1"
            onChange={onChange}
            items={[
              {
                label: `通知（${noticeList?.length}）`,
                key: "1",
                children:
                  noticeList?.length > 0 ? (
                    <ul className="notice-list">
                      {noticeList?.map((item, index) => (
                        <li key={index}>
                          <div
                            className="icon"
                            style={{
                              background: getNoticeStyle(item.type)
                                .backgroundColor,
                            }}
                          >
                            <i
                              style={{
                                color:
                                  getNoticeStyle(item.type).iconColor +
                                  "!important",
                              }}
                            >
                              {getNoticeStyle(item.type).icon}
                            </i>
                          </div>
                          <div className="text">
                            <h4>{item.title}</h4>
                            <p>{item.time}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-tips">
                      <i className="iconfont-sys">&#xe8d7;</i>
                      <p>暂无通知</p>
                    </div>
                  ),
              },
              {
                label: `消息`,
                key: "2",
                children: (
                  <ul className="user-list">
                    {msgList?.map((item, index) => (
                      <li key={index}>
                        <div className="avatar">
                          <img src={item.avatar} />
                        </div>
                        <div className="text">
                          <h4>{item.title}</h4>
                          <p>{item.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                label: `代办`,
                key: "3",
                children: (
                  <ul className="base">
                    {pendingList?.map((item, index) => (
                      <li key={index}>
                        <h4>{item.title}</h4>
                        <p>{item.time}</p>
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
