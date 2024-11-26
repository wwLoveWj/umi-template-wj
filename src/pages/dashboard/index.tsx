import React from "react";
import CardList from "./components/CardList";
import ActiveUser from "./components/ActiveUser";
import TodoList from "./components/TodoList";
import Dynamic from "./components/Dynamic";
import SalesOverview from "./components/SalesOverview";
import styles from "./style.less";
import classNames from "classnames";
import { Row, Col } from "antd";

export default function Index() {
  return (
    <div className={styles.console}>
      <CardList></CardList>
      <Row gutter={20} justify={"space-between"}>
        <Col span={12}>
          <ActiveUser></ActiveUser>
        </Col>
        <Col span={12}>
          <SalesOverview></SalesOverview>
        </Col>
      </Row>
      <Row gutter={20}>
        {/* <NewUser></NewUser> */}
        <Col span={12}>
          <div
            className={classNames(
              styles?.others,
              styles?.rightTodo,
              "box-width"
            )}
            style={{ width: "100%" }}
          >
            666
          </div>
        </Col>
        <Col span={12} className={styles?.rightTodo}>
          <Dynamic></Dynamic>
          <TodoList></TodoList>
        </Col>
      </Row>
    </div>
  );
}
