import React from "react";
import { Tabs, Button } from "antd";
import { MsModal } from "magical-antd-ui";
import { queryLinkCardListAPI } from "@/service/api/link";
import { useRequest } from "ahooks";
import WebsiteSharing from "./components/WebsiteSharing";
import CreateLinkModal from "./components/CreateLinkModal";

export default function Index() {
  // 请求卡片列表信息
  const { data: cardList, run } = useRequest(queryLinkCardListAPI);
  return (
    <>
      <Tabs
        tabBarExtraContent={
          <Button
            type="link"
            onClick={() =>
              MsModal.open(CreateLinkModal).then(() => {
                run();
              })
            }
          >
            增加网址
          </Button>
        }
        items={[
          {
            label: "全部",
            key: "1",
            children: <WebsiteSharing cardList={cardList} />,
          },
        ]}
      />
    </>
  );
}
