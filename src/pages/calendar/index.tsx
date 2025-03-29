import React from "react";
import { WjForm } from "@/components/WjForm";
import { WjTableColumnType } from "@/components/WjTable";
import { history } from "umi";
import WjCalendar from "@/components/WjCalendar/calendar";
import { MsModal } from "magical-antd-ui";
import NotificationModal from "./components/Notice";
import { Button } from "antd";

export default function Index() {
  return (
    <>
      <Button
        onClick={() =>
          MsModal.open(NotificationModal).then((res: any) => {
            debugger;
          })
        }
      >
        通知配置
      </Button>
      <WjCalendar />
    </>
  );
}
