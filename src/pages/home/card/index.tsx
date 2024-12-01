import React from "react";
import CardQuota from "@/components/WjImages/card/index";
import CoffeeMachine from "@/components/WjImages/coffee/index";
import CharacterInfo from "@/components/WjImages/characterInfo/index";
import EmitLightInput from "@/components/WjTime/index";
import styles from "./style.less";
export default function Index() {
  return (
    <div className={styles.personInfoShow}>
      {/* <CoffeeMachine /> */}
      <CharacterInfo />
      <div className={styles.middleContent}>
        <div className={styles?.workInfo}>
          <EmitLightInput />
          <h2 style={{ margin: "20px 12px", textIndent: "2em" }}>
            你已经连续工作12小时了，快来冲杯咖啡喝喝吧~
          </h2>
          {/* <CalendarShow /> */}
        </div>
        <CoffeeMachine />
      </div>
      <CardQuota />
    </div>
  );
}
