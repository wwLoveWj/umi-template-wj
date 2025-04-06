import React, { useState } from "react";
import WjEditor from "@/components/WjEditor/TitleEditor";
import { useLocation, useParams } from "umi";
import { useRequest } from "ahooks";
import {
  ArticleInfoCreateAPI,
  ArticleInfoUpdateAPI,
  ArticleInfoDetailsAPI,
} from "@/service/api/article";
import { guid } from "@/utils";
import { history } from "umi";
const Index: React.FC = () => {
  const { editorId } = useParams() || { editorId: "" };
  // const { editorId } = (useLocation() as any).state || { editorId: "" };
  const isEditMode = !!editorId;
  const [html, setHtml] = useState(""); // 编辑器内容
  const [title, setTitle] = useState(""); //文章标题
  const [imgBg, setImgSrc] = useState(""); //文章主题背景
  // 编辑操作时获取编辑器内容回填
  useRequest(() => ArticleInfoDetailsAPI({ editorId }), {
    refreshDeps: [isEditMode],
    ready: isEditMode,
    onSuccess: (res: API.ArticleTableDataType) => {
      setHtml(res?.editorContent);
      setTitle(res?.title);
      setImgSrc(res?.imgBg);
      // editor && editor.setHtml(res?.editorContent);
      // editorConfig.readOnly = false;
      // editor && editor.restoreSelection(); //恢复选区
      // editor && editor.focus(true);
    },
  });

  // 编辑器的数据保存提交事件
  const saveEditorContent = async () => {
    !isEditMode
      ? await ArticleInfoCreateAPI({
          editorKey: "editor-add",
          editorId: guid(),
          title: title || "默认title",
          imgBg,
        })
      : await ArticleInfoUpdateAPI({
          editorKey: editorId,
          editorId,
          title,
          imgBg,
        });
    history.push("/article/table");
  };

  // 取消按钮返回事件
  const cancelEditorBtn = () => {
    history.push("/article/table");
  };
  const handImgBg = (imgSrc: string) => {
    setImgSrc(imgSrc);
  };
  return (
    <div className="layout-padding-white">
      <WjEditor
        imgSrc={imgBg}
        editorId={editorId}
        saveEditorContent={saveEditorContent}
        editorHtml={html}
        cancelEditorBtn={cancelEditorBtn}
        title={title}
        onChgTitle={setTitle}
        onImgBg={handImgBg}
      />
    </div>
  );
};

export default Index;
