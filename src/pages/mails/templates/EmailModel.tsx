import React from "react";
import styles from "./style.less";
export default function EmailModel({
  color,
  title = "定时提醒主题",
}: {
  color: string;
  title?: string;
}) {
  return (
    <dl className={styles.mailsTemp}>
      <dt>
        <div className={styles?.mailsHead} style={{ background: color }}>
          <span>{title}</span>
        </div>
      </dt>
      <dd>
        <div className={styles?.mailsModal}>
          <h2 style={{ margin: "5px 0px" }}>
            <span style={{ color: "#333333", lineHeight: "20px" }}>
              <span style={{ lineHeight: "22px", fontSize: "18px" }}>
                尊敬的ww：
              </span>
            </span>
          </h2>
          <p style={{ textIndent: "2em" }}>
            您好！请记得
            <span style={{ color: "#ff8c00" }}>xxx</span>
            ，不要忘记哦！
          </p>
          {/* <p style={{ textIndent: "2em" }}>
            科普链接：
            <a href="https://m.baidu.com/bh/m/detail/ar_4715248454193209075">
              维生素和铁的补充
            </a>
          </p> */}
          <br />
          <div style={{ width: "100%", margin: "0 auto" }}>
            <div className={styles.lastName}>
              <p>──ww</p>
              <br />
              <p>
                此为系统邮件，请勿回复
                <br />
                Please do not reply to this system email
              </p>
              <p>©ww</p>
            </div>
          </div>
        </div>
      </dd>
    </dl>
  );
}
