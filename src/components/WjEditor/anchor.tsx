import React, { useState } from "react";
import { Affix, Tooltip } from "antd";
// 获取锚点、目录等公共方法
import { handleItemClick } from "./catalogue";
import "./style.less";
import type { CatalogueType } from "./type";

export default function Anchor({
  tableOfContents,
}: {
  tableOfContents: CatalogueType[];
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0); //设置当前选中的index
  return (
    <Affix offsetTop={140} className={"catalogue"}>
      <div className="table-of-title">
        <span>目录</span>
      </div>
      <ul className="table-of-contents">
        {tableOfContents.map((item, index) => {
          return (
            <li
              key={item.id}
              // 根据不同的标题等级处理间隔h1-h6
              style={{ paddingLeft: item.level * 20 + "px" }}
            >
              <a
                className={activeIndex === index ? "active" : ""}
                href={`#${item.id}`}
                onClick={() => {
                  setActiveIndex(index);
                  handleItemClick(index);
                }}
              >
                <Tooltip title={item.text} color="lime" placement="leftTop">
                  <div className="beyond-hidden">{item.text}</div>
                </Tooltip>
              </a>
            </li>
          );
        })}
      </ul>
    </Affix>
  );
}
