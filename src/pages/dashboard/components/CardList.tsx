import React from "react";
import { SystemMainColor, SystemGradientColor } from "@/utils/color";
import "../style.less";
import {
  SmileOutlined,
  BulbOutlined,
  FireOutlined,
  UserOutlined,
} from "@ant-design/icons";
const dataList = [
  {
    des: "总信息量",
    icon: <SmileOutlined />,
    startVal: 0,
    duration: 1000,
    num: 9120,
    change: "+20%",
    color: SystemGradientColor[5],
  },
  {
    des: "消息",
    icon: <BulbOutlined />,
    startVal: 0,
    duration: 1000,
    num: 182,
    change: "+10%",
    color: "linear-gradient(310deg, #3BDBFF, #61DAE1)",
  },
  {
    des: "待办事项",
    icon: <FireOutlined />,
    startVal: 0,
    duration: 1000,
    num: 9520,
    change: "-12%",
    color: "linear-gradient(310deg,#F56A58,#F55540)",
  },
  {
    des: "新用户",
    icon: <UserOutlined />,
    startVal: 0,
    duration: 1000,
    num: 156,
    change: "+30%",
    color: "linear-gradient(310deg,#A38BE4,#825ee4)",
  },
];
export default function CardList() {
  const showWorkTab = true;
  return (
    <ul className="card" style={{ marginTop: showWorkTab ? "0" : "10px" }}>
      {dataList?.map((item, index) => (
        <li className="console-box-2" key={index}>
          <span className="des custom-text subtitle">{item.des}</span>
          <div>
            {/* <CountTo
                    className="number custom-text box-title"
                    :endVal="item.num"
                    :duration="1000"
                    separator=""
                    ></CountTo> */}
            <span
              className="change"
              style={{
                color: item.change.indexOf("+") === -1 ? "red" : "#52c41a",
              }}
            >
              {item.change}
            </span>
          </div>
          <i
            className="iconfont custom-text"
            style={{
              backgroundImage: `${item.color}`,
            }}
          >
            {item.icon}
          </i>
        </li>
      ))}
    </ul>
  );
}
