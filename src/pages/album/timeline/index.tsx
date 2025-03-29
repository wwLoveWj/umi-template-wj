import React, { useEffect, useRef, useState } from "react";
import "./style.less";

interface TimelineItemType {
  title: string;
  description: string;
  image: string;
  time: string;
}
export default function Index({ items }: { items: TimelineItemType[] }) {
  const timelineRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0); // 当前激活的时间轴项目索引

  useEffect(() => {
    // 页面滚动时触发逻辑
    const handleScroll = () => {
      const timelineElement = timelineRef.current;
      if (!timelineElement) return;

      const scrollPosition = window.scrollY || window.pageYOffset;
      let newActiveIndex = 0;

      items.forEach((item, index) => {
        const itemElement = document.getElementById(`timeline-item-${index}`);
        if (itemElement) {
          const itemTop = itemElement.offsetTop;
          const itemHeight = itemElement.offsetHeight;
          //   console.log(
          //     index,
          //     itemTop - itemHeight / 2,
          //     itemTop + itemHeight / 2
          //   );
          // 判断是否在当前项目的范围内
          if (
            scrollPosition >= itemTop - itemHeight / 2 &&
            scrollPosition < itemTop + itemHeight / 2
          ) {
            newActiveIndex = index;
          }
        }
      });
      // 更新激活的索引
      setActiveIndex(newActiveIndex);
    };

    // 绑定滚动事件
    window.addEventListener("scroll", handleScroll);

    // 初始化时调用一次
    handleScroll();

    // 清理滚动事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className="shell"
      id="shell"
      style={{
        backgroundImage: `url(${items[activeIndex]?.image})`,
      }}
    >
      <div className="header">
        <h2 className="title">把故事说成我们</h2>
        <h3 className="subtitle">WJC BABY</h3>
      </div>
      <div className="timeline" ref={timelineRef}>
        {items.map((item, index) => (
          <div
            data-text={item.title}
            key={index}
            id={`timeline-item-${index}`}
            className={`item ${activeIndex === index ? "item--active" : ""}`}
          >
            <div className="content">
              <img src={item.image} alt={item.title} className="img" />
              <h1 className="content-title">{item.time}</h1>
              <p className="content-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
