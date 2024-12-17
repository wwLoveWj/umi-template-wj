import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/core";
import { uploadImgAPI } from "@/service/api/file";
import React, { useState, useEffect } from "react";
import { Input } from "antd";
import "./style.less";
import type { Iprops } from "./type";

const { TextArea } = Input;
// 图片插入函数类型
type InsertFnType = (url: string, alt: string, href: string) => void;
function MyEditor({
  disabled = false,
  children,
  changeEditorContentWs,
  editorHtml,
  changeEditorTitleWs,
  editorTitle,
  isComment = false,
}: Iprops) {
  //------------------------- 编辑器相关配置----------------------------------
  const [editor, setEditor] = useState<IDomEditor | null>(null); // editor 实例
  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        // 自定义上传
        async customUpload(file: File, insertFn: InsertFnType) {
          await richTextUploadImg(file, insertFn);
          // file 即选中的文件
          // 自己实现上传，并得到图片 url alt href
          // 最后插入图片
        },
        // // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
        // meta: {
        //   token: `Bearer ${getToken()}`,
        // },

        // // 跨域是否传递 cookie ，默认为 false
        // withCredentials: true,
        // // 自定义增加 http  header
        // headers: {
        //   Authorization: `Bearer ${getToken()}`,
        //   // "Content-Type": "multipart/form-data",
        // },
        // // 超时时间，默认为 10 秒
        // timeout: 60 * 1000, // 5 秒
        // // 单个文件的最大体积限制，默认为 2M
        // // maxFileSize: 1 * 1024 * 1024, // 1M

        // // 最多可上传几个文件，默认为 100
        // maxNumberOfFiles: 10,

        // // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        // allowedFileTypes: ["image/*"],
        // // 上传之前触发
        // onBeforeUpload(file: File) {
        //   debugger;
        //   // TS 语法
        //   // onBeforeUpload(file) {    // JS 语法
        //   // file 选中的文件，格式如 { key: file }
        //   return file;

        //   // 可以 return
        //   // 1. return file 或者 new 一个 file ，接下来将上传
        //   // 2. return false ，不上传这个 file
        // },
        // // 单个文件上传成功之后
        // onSuccess(file: File, res: any) {
        //   debugger;
        //   // TS 语法
        //   // onSuccess(file, res) {          // JS 语法
        //   console.log(`${file.name} 上传成功`, res);
        // },

        // // 单个文件上传失败
        // onFailed(file: File, res: any) {
        //   debugger;
        //   // TS 语法
        //   // onFailed(file, res) {           // JS 语法
        //   console.log(`${file.name} 上传失败`, res);
        // },

        // // 上传错误，或者触发 timeout 超时
        // onError(file: File, err: any, res: any) {
        //   debugger;
        //   // TS 语法
        //   // onError(file, err, res) {               // JS 语法
        //   console.log(`${file.name} 上传出错`, err, res);
        // },
      },
      codeSelectLang: {
        // 代码语言
        codeLangs: [
          { text: "CSS", value: "css" },
          { text: "HTML", value: "html" },
          { text: "XML", value: "xml" },
          // 其他
        ],
      },
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    // if (editor) {
    //   editor.on("change", () => {
    //     const selectNodes = editor.getFragment();
    //     const point = editor.selection?.anchor;
    //     const allNodes = editor?.children;
    //     // 获取当前光标位置
    //     const { offset } = point;
    //     console.log("光标位置====", offset);
    //     // console.log(
    //     //   "point",
    //     //   point,
    //     //   "selectNodes",
    //     //   selectNodes,
    //     //   "allNodes",
    //     //   allNodes
    //     // );
    //   });
    // }
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // 是否禁用编辑器，预览编辑效果
  useEffect(() => {
    disabled ? editor?.disable() : editor?.enable;
  }, [editor, disabled]);

  // 编辑器上传图片接口
  const richTextUploadImg = async (file: File, insertFn: InsertFnType) => {
    // 处理入参
    const formData = new FormData();
    formData.append("file", file);
    await uploadImgAPI(formData).then((res) => {
      const imgInfo = res.data.data;
      insertFn(imgInfo?.url, imgInfo?.alt, imgInfo?.href); // 页面插入图片
    });
  };

  // 原文链接：https://blog.csdn.net/weixin_45072119/article/details/140772615
  return (
    <div
      style={{
        border: isComment ? "1px solid #ccc" : "none",
        zIndex: 100,
        width: isComment ? "100%" : "calc(100% - 220px)",
        overflowY: "auto",
      }}
      className="content-editor"
    >
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        className="toobar-editor"
        style={isComment ? { borderBottom: "1px solid #ccc" } : {}}
      />
      {/* =================文章标题================== */}
      {!isComment && (
        <div className="title-editor">
          {editorTitle}
          <TextArea
            className="textareaTitle"
            maxLength={100}
            value={editorTitle}
            onChange={(e: any) => {
              changeEditorTitleWs &&
                changeEditorTitleWs(e.target.value, editor);
            }}
            placeholder="请输入文档标题"
            onPressEnter={() => editor?.focus(false)}
          />
        </div>
      )}
      {children}
      <Editor
        defaultConfig={editorConfig}
        value={editorHtml}
        onCreated={(e) => setEditor(e)}
        onChange={changeEditorContentWs}
        mode="default"
      />
    </div>
  );
}

export default MyEditor;
