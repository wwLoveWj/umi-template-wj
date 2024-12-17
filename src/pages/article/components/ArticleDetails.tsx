import React from "react";
import { useLocation } from "umi";
import "./style.scss";
export default function ArticleDetails() {
  const { title, editorContent } = (useLocation() as any).state;
  debugger;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="article-detail page-content">
      <div className="content">
        <h1>{title}</h1>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: editorContent }}
        ></div>
      </div>
      {/* <BackToTop /> */}
    </div>
  );
}
