import React from "react";
import CardList from "./components/CardList";
import ActiveUser from "./components/ActiveUser";
import TodoList from "./components/TodoList";
import Dynamic from "./components/Dynamic";
import SalesOverview from "./components/SalesOverview";
import "./style.less";

export default function Index() {
  return (
    <div className="console">
      <CardList></CardList>
      <div className="column column2">
        <ActiveUser></ActiveUser>
        <SalesOverview></SalesOverview>
      </div>
      <div className="column column3">
        {/* <NewUser></NewUser> */}
        <Dynamic></Dynamic>
        <TodoList></TodoList>
      </div>
    </div>
  );
}
