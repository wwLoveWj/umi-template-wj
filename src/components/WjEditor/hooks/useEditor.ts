import { useState, useCallback } from "react";
import { message } from "antd";
import { history } from "umi";
import { EditorProps, EditorState, WebSocketMessage } from "../type";
import { websocketMsgHandler } from "../websocket";
import {
  ArticleInfoCreateAPI,
  ArticleInfoUpdateAPI,
} from "@/service/api/article";
import { uploadImgAPI } from "@/service/api/file";
import { generateTableOfContents, addAnchorLinks } from "../catalogue";
import { guid } from "@/utils";

// 图片插入函数类型
type InsertFnType = (url: string, alt: string, href: string) => void;
/**
 * 编辑器自定义 Hook
 * @param props 编辑器属性
 * @returns 编辑器状态和方法
 */
export const useEditor = (props: EditorProps) => {
  const { editorId, isRealTimeediting = true, disabled = false } = props;
  const isEditMode = !!editorId;

  const [state, setState] = useState<EditorState>({
    editor: null,
    html: "",
    title: "",
    tableOfContents: [],
    activeIndex: 0,
  });

  // 保存编辑器内容
  const saveEditorContent = useCallback(async () => {
    if (!state.editor) return;

    try {
      if (!isEditMode) {
        await ArticleInfoCreateAPI({
          editorKey: "editor-add",
          editorId: guid(),
          title: state.title || "默认title",
        });
      } else {
        await ArticleInfoUpdateAPI({
          editorKey: editorId,
          editorId,
          title: state.title,
        });
      }
      message.success("保存成功");
      history.push("/article/table");
    } catch (error) {
      message.error("保存失败");
    }
  }, [state.editor, state.title, isEditMode, editorId]);

  // 发送 WebSocket 消息
  const sendWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      if (isRealTimeediting) {
        websocketMsgHandler(JSON.stringify(message));
      }
    },
    [isRealTimeediting]
  );

  // 处理标题变化
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setState((prev) => ({ ...prev, title: newTitle }));
      sendWebSocketMessage({
        editorContent: state.editor?.getHtml() || "",
        editorKey: !isEditMode ? "editor-add" : editorId,
        title: newTitle,
        isEditMode,
      });
    },
    [state.editor, isEditMode, editorId, sendWebSocketMessage]
  );

  // 处理内容变化
  const handleContentChange = useCallback(() => {
    const newTableOfContents = generateTableOfContents();
    addAnchorLinks();
    setState((prev) => ({ ...prev, tableOfContents: newTableOfContents }));

    if (isRealTimeediting && state.editor) {
      sendWebSocketMessage({
        editorContent: state.editor.getHtml(),
        editorKey: !isEditMode ? "editor-add" : editorId,
        title: state.title,
        isEditMode,
      });
    }
  }, [
    state.editor,
    state.title,
    isEditMode,
    editorId,
    isRealTimeediting,
    sendWebSocketMessage,
  ]);

  // 上传图片
  const handleImageUpload = useCallback(
    async (file: File, insertFn: InsertFnType) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadImgAPI(formData);
        const imgInfo = res.data.data;
        insertFn(imgInfo?.url, imgInfo?.alt, imgInfo?.href);
      } catch (error) {
        message.error("图片上传失败");
      }
    },
    []
  );

  return {
    state,
    setState,
    saveEditorContent,
    handleTitleChange,
    handleContentChange,
    handleImageUpload,
    isEditMode,
  };
};
