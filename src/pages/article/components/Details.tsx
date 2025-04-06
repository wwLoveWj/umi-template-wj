import React from "react";
import { debounce } from "lodash-es";
export default function Details() {
  const hightlight = (id) => {
    document
      .querySelectorAll("a.highlight")
      .forEach((a) => a.classList.remove("highlight"));
    if (id instanceof HTMLElement) {
      id.classList.add("highlight");
      return;
    }
    if (id.startsWith("#")) {
      id = id.substring(1);
    }
    document.querySelector(`a[href="#${id}"]`)?.classList.add("highlight");
  };

  const scrollHandler = debounce(() => {
    const rects = titles.map((title) => title.getBoundingClinetRect());
    const range = 300;
    for (let index = 0; index < titles.length; index++) {
      const title = titles[index];
      const rect = rects[index];
      if (rect.top >= 0 && rect.top <= range) {
        hightlight(title.id);
        break;
      }
      if (
        rect.top < 0 &&
        rects[index + 1] &&
        rects[index + 1].top > document.documentElement.clientHeight
      ) {
        hightlight(title.id);
        break;
      }
    }
  }, 100);

  window.addEventListener("scroll", scrollHandler);

  const links = document.querySelectorAll('.toc a[href^="#"]');

  const titles = [];
  for (const link of links) {
    link.addEventListener("click", () => {
      hightlight(link);
    });
    const url = new URL(link.href);
    const dom = document.querySelector(url.hash);
    if (dom) {
      titles.push(dom);
    }
  }

  return <div>Details</div>;
}
