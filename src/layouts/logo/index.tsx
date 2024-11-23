import React from "react";
import styles from "./style.less";
export default function LogoIndex({ theme }: { theme: "light" | "dark" }) {
  return <div className={styles?.logoLoader} theme={theme}></div>;
}
