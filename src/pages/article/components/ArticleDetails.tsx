import React, { useEffect, useRef } from "react";
import { useLocation } from "umi";
import marked from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css"; // 引入样式
import "./style.scss";
import BackToTop from "@/components/Buttons/BackToTop";
export default function ArticleDetails() {
  const { title, editorContent } = (useLocation() as any).state;
  const articleRef = useRef(null);
  // const renderedHtml = () => {
  //   // 使用 marked 将 Markdown 转换为 HTML
  //   const html = marked(editorContent);
  //   // 使用 highlight.js 高亮代码块
  //   const highlightedHtml = html.replace(
  //     /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
  //     (match, code) => {
  //       const language = match.match(/class="language-(\w+)"/);
  //       const lang = language ? language[1] : null;
  //       return `<pre><code>${
  //         hljs.highlight(code, { language: lang }).value
  //       }</code></pre>`;
  //     }
  //   );

  //   return highlightedHtml;
  // };

  const scrollToTop = () => {
    const dom = document.querySelector(
      ".my-template-umi-ant-layout-content"
    ) as HTMLDivElement;
    dom.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const main = document.getElementById("main") as HTMLDivElement;
    const body = document.getElementById("body") as HTMLDivElement;
    const words = body.innerText.split("");
    function write() {
      if (words.length > 0) {
        var span = document.createElement("span");
        var dele = words.shift();
        var opc = 0;
        span.innerHTML = dele;
        main.parentNode?.insertBefore(span, main);
        // main.setAttribute(
        //   "dangerouslySetInnerHTML",
        //   JSON.stringify({ __html: main })
        // );

        var fade = setInterval(function () {
          opc++;
          span.style.opacity = opc / 10;
          span.style.color = "transparent";
          span.style.textShadow =
            "0 0 5px #57606f,0 0 10px #57606f,0 0 4px #57606f,0 0 12px #ffa502";
          span.style.filter = "blur(" + (10 / opc - 1) + "px)";
          if (opc >= 10) {
            clearInterval(fade);
            span.style.color = "#2f3542";
          }
        }, 50);
      }
    }
    const timer = setInterval(write, 50);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className="article-detail" ref={articleRef}>
      <div className="content-article" id="main">
        <h1>{title}</h1>
        <div id="main"></div>
        <div
          className="markdown-body"
          id="body"
          // style={{ opacity: "0" }}
          dangerouslySetInnerHTML={{ __html: editorContent }}
        ></div>
      </div>
      <BackToTop scrollToTop={scrollToTop} />
    </div>
  );
}
