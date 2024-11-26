import React from "react";
import { Row, Col, Flex, Avatar, Tooltip } from "antd";
import styles from "./style.less";
import {
  queryLinkCardListAPI,
  createLinkCardListAPI,
} from "@/service/api/link";
import { useRequest } from "ahooks";
import { randomColor } from "@/utils/color";

export default function WebsiteSharing() {
  // 请求卡片列表信息
  const { data: cardList } = useRequest(async () => {
    const res = await queryLinkCardListAPI({});
    debugger;
    return res;
  });
  return (
    <Row gutter={[16, 16]}>
      {(cardList || [])?.map((item) => {
        return (
          <Col span={6} key={item.id}>
            <div className={styles.animateCard}>
              <a href={item.link} target="_blank">
                <div
                  style={{ background: randomColor() }}
                  className={styles.bg}
                >
                  <h1>{item.name}</h1>
                </div>
                <div className={styles.technologyContent}>
                  {/* window.location.href = "https://www.baidu.com";//当前页面跳转到指定链接(不打开新页面)
                window.open("https://www.baidu.com");//在新的窗口打开指定链接 */}
                  <Flex wrap gap="small" align="center">
                    <Avatar
                      style={{
                        backgroundColor: "#f56a00",
                        verticalAlign: "middle",
                      }}
                      gap={8}
                      size={52}
                      src={item.avatar}
                    ></Avatar>
                    <div style={{ marginLeft: "6px" }}>
                      <h3>{item.name}</h3>
                      <Tooltip placement="bottomLeft" title={item.description}>
                        <div className={styles.desc}>{item.description}</div>
                      </Tooltip>
                    </div>
                  </Flex>
                </div>
              </a>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}
