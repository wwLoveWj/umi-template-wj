import { IDomEditor } from "@wangeditor/core";
// ------------websocket的创建关闭及心跳应答--------------------
import {
  createWebSocket,
  closeWebSocket,
  // websocket,
  websocketMsgHandler,
} from "./websocket";
import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import _ from "lodash-es";
import { generateTableOfContents } from "./catalogue";
import MyEditor from "./editor";
import Anchor from "./anchor";
import WjUpload from "@/components/WjUpload";
import { TitleEditorProps, CatalogueType } from "./type";
import "./style.less";

function WjEditor({
  saveEditorContent, //文章保存按钮
  cancelEditorBtn, //取消按钮
  title = "默认标题", //默认标题
  onChgTitle, //title的随时变更事件
  editorHtml, //编辑器内容区
  editorId, //编辑时才有这个
  isRealTimeediting = true,
  disabled = false,
  onImgBg,
  imgSrc = "",
}: TitleEditorProps) {
  debugger;
  const isEditMode = !!editorId;
  // 左侧锚点集合
  const [tableOfContents, setTableOfContents] = useState<CatalogueType[]>([]); //目录结构集合
  // 标题的输入事件
  const changeEditorTitle = (e: IDomEditor) => {
    websocketMsgHandler(
      JSON.stringify({
        editorContent: e?.getHtml(), //标题输入不用传内容吧，更新标题部分即可
        editorKey: !isEditMode ? "editor-add" : editorId,
        title,
        isEditMode, //编辑器操作类型，用于判断是否更新数据库
      })
    );
  };
  const changeEditorTitleWs = _.debounce(changeEditorTitle, 600);

  // 当编辑器内容改变时
  const changeEditorContent = (e: IDomEditor) => {
    setTableOfContents(generateTableOfContents());
    if (isRealTimeediting && e) {
      websocketMsgHandler(
        JSON.stringify({
          editorContent: e.getHtml(),
          editorKey: !isEditMode ? "editor-add" : editorId,
          title,
          isEditMode,
        })
      );
      // 原文链接：https://blog.csdn.net/qq_35891206/article/details/132626741
      console.log(e.getHtml(), "文章内容-------------------------", isEditMode);
    }
  };

  const changeEditorContentWs = _.debounce(changeEditorContent, 600);

  //============================加载时================================
  useEffect(() => {
    if (isRealTimeediting) {
      createWebSocket("ws://localhost:3007");
    }
    return () => {
      if (isRealTimeediting) {
        closeWebSocket();
      }
    };
  }, []);
  // 原文链接：https://blog.csdn.net/weixin_45072119/article/details/140772615
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

  const scrollHandler = _.debounce(() => {
    const links = document.querySelectorAll('.table-of-contents a[href^="#"]');

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
    debugger;
    const rects = titles.map((title) => title.getBoundingClientRect());
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

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);
  return (
    <div className="allEditorInfo">
      {/* =============编辑器部分================== */}
      <MyEditor
        changeEditorContentWs={changeEditorContentWs}
        editorHtml={editorHtml}
        disabled={disabled}
        changeEditorTitleWs={(val, editor) => {
          onChgTitle(val);
          changeEditorTitleWs(editor);
        }}
        editorTitle={title}
      >
        <WjUpload onImgBg={onImgBg} imgSrc={imgSrc} />
      </MyEditor>
      <div className="right-section">
        <Space className="upload-btn">
          {/* 取消回到文章列表页并提醒是否需要保存 */}
          <Button onClick={cancelEditorBtn}>取消</Button>
          <Button type="primary" onClick={saveEditorContent}>
            更新
          </Button>
        </Space>
        {/* =============右侧目录部分================ */}
        <Anchor tableOfContents={tableOfContents} />
      </div>
    </div>
  );
}

export default WjEditor;
