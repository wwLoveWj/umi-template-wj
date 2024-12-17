import { IDomEditor } from "@wangeditor/core";
// ------------websocket的创建关闭及心跳应答--------------------
import {
  createWebSocket,
  closeWebSocket,
  // websocket,
  websocketMsgHandler,
} from "./websocket";
import React, { useEffect, useRef } from "react";
import { Button, Space } from "antd";
import _ from "lodash-es";
import "./style.less";
import MyEditor from "./editor";
import Anchor from "./anchor";
import { TitleEditorProps } from "./type";

function WjEditor({
  saveEditorContent, //文章保存按钮
  cancelEditorBtn, //取消按钮
  title = "默认标题", //默认标题
  onChgTitle, //title的随时变更事件
  editorHtml, //编辑器内容区
  editorId, //编辑时才有这个
  isRealTimeediting = true,
  disabled = false,
}: TitleEditorProps) {
  const anchorRef = useRef(null);
  const isEditMode = !!editorId;

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
    // anchorRef.current?.addAnchorLink();
    if (isRealTimeediting && e) {
      websocketMsgHandler(
        JSON.stringify({
          editorContent: e.getHtml(),
          editorKey: !isEditMode ? "editor-add" : editorId,
          title,
          isEditMode,
        })
      );
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
      ></MyEditor>
      <div className="right-section">
        <Space className="upload-btn">
          {/* 取消回到文章列表页并提醒是否需要保存 */}
          <Button onClick={cancelEditorBtn}>取消</Button>
          <Button type="primary" onClick={saveEditorContent}>
            更新
          </Button>
        </Space>
        {/* =============右侧目录部分================ */}
        <Anchor ref={anchorRef} />
      </div>
    </div>
  );
}

export default WjEditor;
