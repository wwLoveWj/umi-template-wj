import React, { useEffect, useRef } from "react";
import { WjForm } from "@/components/WjForm";
import { history } from "umi";
import { Button, Progress, Rate, Tabs } from "antd";
import { WjDrawer } from "magical-antd-ui";
import { FeedingInfoListQueryAPI } from "@/service/api/baby";
import { storage } from "@/utils/storage";
import BasicDrawer from "./components/BasicDrawer";
import { Chart } from "@antv/g2";
import WjTable, { WjTableColumns, WjTableRefType } from "@/components/WjTable";

const eventTypeOptions = [
  {
    label: "换尿布",
    value: 1,
  },
  {
    label: "吃奶",
    value: 2,
  },
];
export default function Index() {
  const actionRef = useRef<WjTableRefType>(null);
  // 当前用户邮箱
  const currentEmail = storage.get("login-info")?.email || "";
  const columns: WjTableColumns = [
    {
      dataIndex: "eventType",
      title: "主题",
      render: (value) =>
        eventTypeOptions.find((item) => item?.value === value)?.label,
    },
    {
      dataIndex: "milkYield",
      title: "奶量",
      render: (value) => <Progress percent={(value / 80) * 100} size="small" />,
    },
    {
      dataIndex: "feedingTime",
      title: "吃奶时间",
    },
    {
      valueType: "select",
      dataIndex: "feedingStatus",
      search: true,
      title: "完成情况",
      fieldProps: {
        options: [
          {
            label: "未完成",
            value: 0,
          },
          {
            label: "已完成",
            value: 1,
          },
        ],
        placeholder: "请选择完成情况",
      },
      render: (value) => {
        return <Rate disabled value={value} />;
      },
    },
    {
      dataIndex: "description",
      title: "备注",
    },
  ];

  const requestChart = async () => {
    const res = await FeedingInfoListQueryAPI();
    const data = res?.list;
    const chart = new Chart({
      container: "container",
      autoFit: true,
      insetRight: 10,
    });

    chart
      .line()
      .data(data)
      // .transform({ type: "normalizeY", basis: "first", groupBy: "color" })
      .encode("x", "feedingTime")
      .encode("y", "milkYield")
      .encode("color", "createTime")
      .scale("y", { type: "log" })
      .axis("y", { title: "↑ 奶量 (ml)" })
      .axis("x", { title: "喝奶时间点" }) //去除X轴标题
      .label({
        text: "createTime",
        selector: "last",
        style: {
          dx: -5,
          dy: -12,
        }, // 样式-偏移量
        transform: [{ type: "overlapDodgeY" }], // 位置碰撞的标签在 y 方向上进行调整，防止标签重叠
        fontSize: 12, //字体大小
      })
      .scale("x", {
        range: [0, 1],
      }) //将数据转换到 [0, 1] 范围内，方便将数据映射到位置、颜色、大小等图形属性；这边注释掉也行
      .scale("y", {
        nice: true, //扩展 domain 范围，让输出的 tick 展示得更加友好
        domainMin: 30, //最小值
      })
      // 原文链接：https://blog.csdn.net/weixin_46861111/article/details/144852578
      .tooltip({ channel: "y", valueFormatter: ".1f" })
      .encode("shape", "smooth") //曲线光滑
      .animate("enter", { type: "pathIn", duration: 1000 });
    chart.render();
    // 图表antv：https://g2.antv.antgroup.com/examples
  };
  useEffect(() => {
    requestChart();
  }, []);
  return (
    <>
      <Tabs
        type="card"
        defaultActiveKey={"2"}
        indicator={{ size: (origin) => origin - 20, align: "center" }}
        items={[
          {
            title: "吃奶列表",
            key: "1",
            children: (
              <WjTable
                actionRef={actionRef}
                columns={columns}
                scroll={{ y: "auto-content" }}
                request={{
                  url: FeedingInfoListQueryAPI,
                  params: { currentEmail },
                }}
                rowKey="feedingId"
                createBtnOperations={[
                  <Button
                    type="primary"
                    onClick={() =>
                      WjDrawer.open(BasicDrawer).then((res: any) => {
                        debugger;
                        actionRef.current?.reload();
                      })
                    }
                  >
                    吃奶记录
                  </Button>,
                ]}
              />
            ),
          },
          { title: "吃奶看板", key: "2", children: <div id="container"></div> },
        ].map((item) => {
          return {
            label: item.title,
            key: item.key,
            children: item.children,
          };
        })}
      />
    </>
  );
}
