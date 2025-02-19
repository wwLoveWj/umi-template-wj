import React, { useCallback, MouseEvent, useState } from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "./style.scss";
import { MsModal } from "magical-antd-ui";
import EventModal from "./components/EventModal";
import classNames from "classnames";
import {
  CalendarInfoListQueryAPI,
  CalendarInfoUpdateAPI,
  CalendarInfoCreateAPI,
} from "@/service/api/calendar";
import { useRequest } from "ahooks";
// 原文链接：https://blog.csdn.net/weixin_45389051/article/details/139958483

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const App: React.FC = () => {
  const [events, setEvents] = useState<API.CalendarEvent[]>([
    // {
    //   startDate: "2025-02-01",
    //   content: "产品需求评审",
    //   type: "warning",
    // },
    // {
    //   startDate: "2025-02-03",
    //   endDate: "2025-02-05",
    //   content: "项目周报会议（跨日期）",
    //   type: "warning",
    // },
    // {
    //   startDate: "2025-02-10",
    //   content: "瑜伽课程",
    //   type: "error",
    //   endDate: "2025-02-11",
    // },
    // { startDate: "2025-02-15", content: "团队建设活动", type: "warning" },
    // { startDate: "2025-02-20", content: "健身训练", type: "error" },
    // { startDate: "2025-02-20", content: "代码评审", type: "warning" },
    // { startDate: "2025-02-20", content: "团队午餐", type: "warning" },
    // { startDate: "2025-02-20", content: "项目进度汇报", type: "warning" },
    // { startDate: "2025-02-28", content: "月度总结会", type: "warning" },
  ]);
  // 获取待办信息
  const CalendarInfoListQueryRun = useRequest(CalendarInfoListQueryAPI, {
    onSuccess: (res) => {
      setEvents(res?.list);
    },
  });

  const CalendarInfoUpdateRun = useRequest(CalendarInfoUpdateAPI, {
    manual: true,
    onSuccess: (res) => {
      debugger;
      CalendarInfoListQueryRun.run({});
    },
  });

  const CalendarInfoCreateRun = useRequest(CalendarInfoCreateAPI, {
    manual: true,
    onSuccess: (res) => {
      CalendarInfoListQueryRun.run({});
    },
  });
  //   useEffect(() => {
  //     const diffInMilliseconds = dayjs("20250218").diff(dayjs("20250301"));

  //     const diffInMilliseconds2 = dayjs("2025-02-01").diff(dayjs("2025-02-01"));
  //     // 对比差值是否大于0来判断日期1是否晚于日期2
  //     const isDate1AfterDate2 = diffInMilliseconds >= 0;

  //     // 对比差值是否小于0来判断日期1是否早于日期2
  //     const isDate1BeforeDate2 = diffInMilliseconds2 <= 0;
  //   }, []);
  // 判断大于等于
  const handisOnOrAfterToday = (start: Dayjs, end: Dayjs) => {
    const isOnOrAfterToday = start.isSameOrAfter(end, "day");
    return isOnOrAfterToday;
  };
  // 判断小于等于
  const handisSameOrBefore = (start: Dayjs, end: Dayjs) => {
    const isBeforeToday = start.isSameOrBefore(end, "day");
    return isBeforeToday;
  };
  const getEvents = useCallback(
    (day: Dayjs) => {
      return events.filter((event) => {
        const eventDate = dayjs(event.startDate);
        const currentDate = dayjs(day);

        const endDate = event.endDate
          ? dayjs(event.endDate)
          : dayjs(event.startDate);
        // debugger;
        // 使用diff方法获取日期1和日期2之间的差值（单位：毫秒）
        // const diffInMilliseconds = currentDate.diff(eventDate);
        // const diffInMilliseconds2 = currentDate.diff(endDate);
        // // 对比差值是否大于0来判断日期1是否晚于日期2
        // const isDate1AfterDate2 = diffInMilliseconds >= 0;
        // // 对比差值是否小于0来判断日期1是否早于日期2
        // const isDate1BeforeDate2 = diffInMilliseconds2 <= 0;
        // console.log(
        //   currentDate.format("YYYY-MM-DD"),
        //   eventDate.format("YYYY-MM-DD"),

        //   isDate1AfterDate2,
        //   endDate.format("YYYY-MM-DD"),
        //   isDate1BeforeDate2,
        //   diffInMilliseconds2
        //   );
        const result =
          handisOnOrAfterToday(currentDate, eventDate) &&
          handisSameOrBefore(currentDate, endDate);
        return result;
        // return currentDate >= eventDate && currentDate <= endDate;
        // return isDate1AfterDate2 && isDate1BeforeDate2;
      });
    },
    [events]
  );
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  // 新增事件处理函数
  const handleCellClick = (day: Dayjs) => {
    MsModal.open(EventModal).then((res: any) => {
      CalendarInfoCreateRun.run(res);
    });
  };
  // 更新事件
  const handleEventClick = (
    e: MouseEvent<HTMLLIElement>,
    editInfo: API.CalendarEvent
  ) => {
    e.stopPropagation();
    const startDate = dayjs(editInfo.startDate);
    const endDate = dayjs(editInfo.endDate);
    const event: API.CalendarEvent = {
      ...editInfo,
      startDate,
      endDate,
    };
    //    找到事件中对应项
    const idx = events.findIndex(
      (val) =>
        val.startDate === dayjs(event.startDate).format("YYYY-MM-DD") &&
        val.content === event.content
    );

    MsModal.open(EventModal, {
      editInfo: event,
    }).then((res: any) => {
      CalendarInfoUpdateRun.run(res);
    });
  };
  const dateCellRender = (value: Dayjs) => {
    return (
      <ul className="events" onClick={() => handleCellClick(value)}>
        {getEvents(value).map((item) => (
          <li
            key={item.calendarId}
            onClick={(e) => handleEventClick(e, item)}
            className={classNames("event-tag", `${"bg-" + item.type}`)}
          >
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} showWeek={true} />;
};

export default App;
