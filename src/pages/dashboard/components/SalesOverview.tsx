import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { getCssVariable, hexToRgba } from "@/utils/color";
import classNames from "classnames";
import style from "./sale.less";
import "../style.less";

export default function SalesOverview() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const isLight = true;
  const createChart = (chartInstance) => {
    chartInstance?.setOption({
      grid: {
        left: "2.2%",
        right: "3%",
        bottom: "0%",
        top: "5px",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021",
        ],
        axisLabel: {
          show: true,
          color: "#999",
          margin: 20,
          interval: 0,
          fontSize: 13,
          fontWeight: "bold",
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          show: true,
          color: "#999",
          fontSize: 13,
          fontWeight: "bold",
        },
        axisLine: {
          show: isLight ? true : false,
          lineStyle: {
            color: "#E8E8E8",
            width: 1,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isLight ? "#e8e8e8" : "#444",
            width: 1,
            type: "dashed",
          },
        },
      },
      series: [
        {
          name: "销售",
          color: getCssVariable("--main-color"),
          type: "line",
          stack: "总量",
          data: [80, 40, 300, 200, 500, 250, 160, 304, 180],
          smooth: true,
          symbol: "none",
          lineStyle: {
            width: 2.6,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: hexToRgba(getCssVariable("--art-success"), 0.2).rgba,
              },
              {
                offset: 1,
                color: hexToRgba(getCssVariable("--art-warning"), 0.01).rgba,
              },
            ]),
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
    <div className={classNames(style.region, "sales-overview", "console-box")}>
      <div className={style.cardHeader}>
        <div className="title">
          <h4 className="custom-text box-title">访问量</h4>
          <p className="custom-text subtitle">
            今年增长<span>+15%</span>
          </p>
        </div>
      </div>
      <div className={style.chart} ref={chartRef}></div>
    </div>
  );
}
