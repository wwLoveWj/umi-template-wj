import React, { useRef, useEffect, useState } from "react";
import { getCssVariable } from "@/utils/color";
import * as echarts from "echarts";
import "./styles/active.scss";

const list = [
  { name: "总用户量", num: "32k" },
  { name: "总访问量", num: "128k" },
  { name: "日访问量", num: "1.2k" },
  { name: "周同比", num: "+5%" },
];
export default function ActiveUser() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [currentTheme, setCurrentTheme] = useState(
    JSON.parse(
      localStorage?.getItem("systemColor") || `{systemThemeType:light}`
    )?.systemThemeType
  );
  //   const { setOptions, removeResize, resize } = useECharts(
  //     chartRef as Ref<HTMLDivElement>
  //   );
  const isDark = currentTheme === "dark";

  const createChart = (chartInstance) => {
    chartInstance?.setOption({
      grid: {
        left: "0",
        right: "4%",
        bottom: "0%",
        top: "5px",
        containLabel: true,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          show: true,
          color: isDark ? "#999" : "#fff",
          fontSize: 13,
          fontWeight: "bold",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: !isDark ? "rgba(255, 255, 255, 0.2)" : "#444",
            width: 1,
            type: "dashed",
          },
        },
        axisLine: {
          show: false,
        },
      },
      xAxis: {
        type: "category",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        boundaryGap: [0, 0.01],
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          color: isDark ? "#999" : "#fff",
          fontSize: 13,
          fontWeight: "bold",
        },
      },
      series: [
        {
          data: [160, 100, 150, 80, 190, 100, 175, 120, 160],
          type: "bar",
          barMaxWidth: 20,
          color: isDark ? getCssVariable("--main-color") : "#fff",
          itemStyle: {
            borderRadius: [6, 6, 6, 6],
          },
        },
      ],
    });
  };

  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current);
    createChart(chartInstance);
  }, []);
  return (
    <div className="region-activeUser console-box box-width">
      <div className="chart" ref={chartRef}></div>
      <>
        <div className="text">
          <h3 className="custom-text box-title">用户概述</h3>
          <p className="custom-text subtitle">
            比上周 <span>+23%</span>
          </p>
          <p className="custom-text subtitle">
            我们为您创建了多个选项，可将它们组合在一起并定制为像素完美的页面
          </p>
        </div>
        <div className="list">
          {list?.map((item, index) => (
            <div key={index}>
              <p>{item.num}</p>
              <p className="custom-text subtitle">{item.name}</p>
            </div>
          ))}
        </div>
      </>
    </div>
  );
}
