import React from "react";
import { Button } from "antd";
import { MsModal } from "magical-antd-ui";
import Setting from "./settings";

export default function MailIndex() {
  return (
    <div>
      邮件中心
      <Button onClick={() => MsModal.open(Setting)}>邮箱配置</Button>
    </div>
  );
}
