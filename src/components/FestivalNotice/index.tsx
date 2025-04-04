import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { getCurrentFestival } from "@/utils/festival";
import styles from "./style.less";

/**
 * 节日提示组件
 */
const FestivalNotice: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  const [festivalInfo, setFestivalInfo] = useState<{
    name: string;
    date: string;
    isToday: boolean;
  } | null>(null);
  const [displayLines, setDisplayLines] = useState<string[][]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const festival = getCurrentFestival();
    if (festival) {
      setFestivalInfo(festival);
      setVisible(true);
      const poem = getFestivalWish(festival.name);
      // 根据句号、逗号、问号等符号分隔诗句
      const lines = poem.split(/[。，？！]/).filter((line) => line.trim());
      setDisplayLines(lines.map((line) => line.split("")));
    }
  }, []);

  useEffect(() => {
    if (displayLines.length > 0) {
      if (currentLineIndex < displayLines.length) {
        if (currentCharIndex < displayLines[currentLineIndex].length) {
          const timer = setTimeout(() => {
            setCurrentCharIndex((prev) => prev + 1);
          }, 150);
          return () => clearTimeout(timer);
        } else {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }
      }
    }
  }, [currentLineIndex, currentCharIndex, displayLines]);

  const handleClose = () => {
    setVisible(false);
  };

  if (!festivalInfo) return null;

  // 获取当前诗句的标点符号
  const getPunctuation = (lineIndex: number) => {
    const poem = getFestivalWish(festivalInfo.name);
    const punctuations = poem.match(/[。，？！]/g) || [];
    return punctuations[lineIndex] || "。";
  };

  return (
    // <div className={styles.mainContent}>
    //   <div className={styles.illustration}>
    //     <img
    //       src={require("@/assets/imgs/festival/qingming.png")}
    //       alt="牧童遥指杏花村"
    //     />
    //   </div>
    <div className={styles.content}>
      <div className={styles.closeButton} onClick={onClose} />
      <div className={styles.title}>
        今天是{festivalInfo.isToday ? "" : "正值"}
        {festivalInfo.name}
      </div>
      <div className={styles.date}>日期：{festivalInfo.date}</div>

      <div className={styles.wish}>
        {displayLines.slice(0, currentLineIndex + 1).map((line, lineIndex) => (
          <div key={lineIndex} className={styles.poemLine}>
            {line.map((char, charIndex) => (
              <span
                key={charIndex}
                className={styles.character}
                style={{
                  animationDelay: `${
                    (lineIndex * line.length + charIndex) * 0.15
                  }s`,
                }}
              >
                {char}
              </span>
            ))}
            {lineIndex < currentLineIndex && (
              <span
                className={styles.character}
                style={{
                  animationDelay: `${
                    (lineIndex * line.length + line.length) * 0.15
                  }s`,
                }}
              >
                {getPunctuation(lineIndex)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
    // </div>
  );
};

/**
 * 获取节日祝福语
 * @param festivalName 节日名称
 * @returns string
 */
const getFestivalWish = (festivalName: string): string => {
  const wishes: Record<string, string> = {
    元旦: "新年新气象，祝您元旦快乐！",
    春节: "恭贺新禧，祝您春节快乐，阖家幸福！",
    清明节: "清明时节雨纷纷，路上行人欲断魂。借问酒家何处有，牧童遥指杏花村。",
    劳动节: "劳动最光荣，祝您劳动节快乐！",
    端午节: "端午安康，愿您幸福安康！",
    中秋节: "月圆人团圆，祝您中秋节快乐！",
    国庆节: "祝福祖国繁荣昌盛，祝您国庆节快乐！",
  };

  return wishes[festivalName] || "祝您节日快乐！";
};

export default FestivalNotice;
