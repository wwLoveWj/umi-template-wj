import React from "react";
import CardList from "./components/CardList";
import ActiveUser from "./components/ActiveUser";
import TodoList from "./components/TodoList";
import Dynamic from "./components/Dynamic";
import SalesOverview from "./components/SalesOverview";
import styles from "./style.less";
import { Row, Col } from "antd";

export default function Index() {
  return (
    <div className={styles.console}>
      <CardList></CardList>
      <Row gutter={20}>
        <Col span={12}>
          <ActiveUser></ActiveUser>
        </Col>
        <Col span={12}>
          <SalesOverview></SalesOverview>
        </Col>
        {/* <NewUser></NewUser> */}
        <Col span={12}>
          <Dynamic></Dynamic>
        </Col>
        <Col span={12}>
          <TodoList></TodoList>
        </Col>
      </Row>
    </div>
  );
}
