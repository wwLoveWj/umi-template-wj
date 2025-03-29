import React from "react";
import Timeline from "./components/Timeline";
export default function Waterfall() {
  const timelineItems = [
    {
      time: "12.28",
      title: "我们出生了~",
      description: "这是第一阶段的内容。",
      image: require("@/assets/imgs/baby/2025032801.jpg"),
    },
    {
      time: "04.01",
      title: "会翻身了",
      description:
        "如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。",
      image:
        "https://img2.baidu.com/it/u=815774148,3892081775&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1741107600&t=a34940ab279a5306e0e51da75fd4f72a",
    },
    {
      time: "06.28",
      title: "我们会说话了~",
      description: "这是第三阶段的内容。",
      image: require("@/assets/imgs/baby/2025032802.jpg"),
    },
  ];
  return (
    <div>
      <Timeline items={timelineItems} />
    </div>
  );
}
