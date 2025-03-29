import React from "react";
import { Tabs, Button, Input } from "antd";
import type { GetProps } from "antd";
import { MsModal } from "magical-antd-ui";
import { queryLinkCardListAPI } from "@/service/api/link";
import { useRequest } from "ahooks";
import WebsiteSharing from "./components/WebsiteSharing";
import CreateLinkModal from "./components/CreateLinkModal";
import styles from "./style.less";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
export default function Index() {
  // 请求卡片列表信息
  const { data: cardList, run } = useRequest(queryLinkCardListAPI);
  const onSearch: SearchProps["onSearch"] = (value) => run({ keyWords: value });
  return (
    <div className={styles.websiteSharing}>
      <Tabs
        tabBarExtraContent={
          <>
            <Search
              placeholder="请输入网址名称查询"
              onSearch={onSearch}
              style={{ width: 200 }}
              variant="outlined"
            />
            <Button
              type="link"
              onClick={() =>
                MsModal.open(CreateLinkModal).then(() => {
                  run();
                })
              }
            >
              添加网址
            </Button>
          </>
        }
        items={[
          {
            label: "全部",
            key: "1",
            children: <WebsiteSharing cardList={cardList} />,
          },
        ]}
      />
    </div>
  );
}
