import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IEditorConfig, IToolbarConfig } from "@wangeditor/core";
// ------------websocket的创建关闭及心跳应答--------------------
import { createWebSocket, closeWebSocket } from "./websocket";
import { useRequest } from "ahooks";
import { ArticleInfoDetailsAPI } from "@/service/api/article";
import React, { useEffect } from "react";
import { Button, Affix, Tooltip, Space, Input } from "antd";
import { history } from "umi";
import _ from "lodash-es";
// 获取锚点、目录等公共方法
import { handleItemClick, getAllHtagList } from "./catalogue";
import styles from "./style.less";
import "./style.less";
import type { CatalogueType, Iprops } from "./type";
import { useEditor } from "./hooks/useEditor";

const { TextArea } = Input;

/**
 * 富文本编辑器组件
 */
const WjEditor: React.FC<Iprops> = (props) => {
  const {
    state,
    setState,
    saveEditorContent,
    handleTitleChange,
    handleContentChange,
    handleImageUpload,
    isEditMode,
  } = useEditor(props);

  const { editor, title, tableOfContents, activeIndex } = state;

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        customUpload: handleImageUpload,
        //  // 自定义上传
        // async customUpload(file: File, insertFn: InsertFnType) {
        //   await richTextUploadImg(file, insertFn);
        //   // file 即选中的文件
        //   // 自己实现上传，并得到图片 url alt href
        //   // 最后插入图片
        // },
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
        codeLangs: [
          { text: "CSS", value: "css" },
          { text: "HTML", value: "html" },
          { text: "XML", value: "xml" },
        ],
      },
    },
  };

  // ---------------------------外部使用时传递的参数-----------------------------
  // const detailsData = (useLocation() as any).state;
  const {
    editorId,
    isRealTimeediting = true,
    disabled = false,
  }: Iprops = props;

  //   获取编辑器信息
  const searchEditorTxtApi = useRequest(
    () => ArticleInfoDetailsAPI({ editorId }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: (res: API.ArticleTableDataType) => {
        setState((prev) => ({
          ...prev,
          html: res?.editorContent || "",
          title: res?.title || "",
        }));
        editor && editor.setHtml(res?.editorContent || "");
        // editorConfig.readOnly = false;
        // editor && editor.restoreSelection(); //恢复选区
        // editor && editor.focus(true);
      },
    }
  );

  // 取消回到文章列表页并提醒是否需要保存
  const handleCancel = () => {
    history.push("/article/table");
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
      setState((prev) => ({ ...prev, editor: null }));
    };
  }, [editor]);
  // 处理禁用状态
  useEffect(() => {
    if (editor) {
      disabled ? editor?.disable() : editor?.enable();
    }
  }, [editor, disabled]);
  useEffect(() => {
    if (isEditMode) {
      // 编辑操作时获取编辑器内容回填
      searchEditorTxtApi.run();
    }
    if (isRealTimeediting) {
      createWebSocket("ws://localhost:3007");
    }
    return () => {
      if (isRealTimeediting) {
        closeWebSocket();
      }
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  // 处理目录项点击
  const handleCatalogueClick = (index: number) => {
    setState((prev) => ({ ...prev, activeIndex: index }));
    handleItemClick(index);
  };

  return (
    <div className={styles.allEditorInfo}>
      {/* =============编辑器部分================== */}
      <div
        style={{
          // border: "1px solid #ccc",
          zIndex: 100,
          width: "calc(100% - 220px)",
          overflowY: "auto",
        }}
        className="content-editor"
      >
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          className="toobar-editor"
          // style={{
          //   borderBottom: "1px solid #ccc",
          // }}
        />
        {/* =================文章标题================== */}
        <div className="title-editor">
          {title}
          <TextArea
            className="textareaTitle"
            maxLength={100}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="请输入文档标题"
            onPressEnter={() => editor?.focus(false)}
          />
        </div>
        <Editor
          defaultConfig={editorConfig}
          value={state.html}
          onCreated={(e) => setState((prev) => ({ ...prev, editor: e }))}
          onChange={(e) => {
            if (e) {
              handleContentChange();
            }
          }}
          mode="default"
        />
      </div>
      <div className="right-section">
        <Space className="upload-btn">
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={saveEditorContent}>
            更新
          </Button>
        </Space>
        {/* =============右侧目录部分================ */}
        <Affix offsetTop={140} className={styles.catalogue}>
          <div className="table-of-title">
            <span>目录</span>
          </div>
          <ul className="table-of-contents">
            {tableOfContents.map((item, index) => {
              return (
                <li
                  key={item.id}
                  // 根据不同的标题等级处理间隔h1-h6
                  style={{ paddingLeft: item.level * 20 + "px" }}
                >
                  <a
                    className={activeIndex === index ? "active" : ""}
                    href={`#${item.id}`}
                    onClick={() => handleCatalogueClick(index)}
                  >
                    <Tooltip title={item.text} color="lime" placement="leftTop">
                      <div className="beyond-hidden">{item.text}</div>
                    </Tooltip>
                  </a>
                </li>
              );
            })}
          </ul>
        </Affix>
      </div>
    </div>
  );
};

export default WjEditor;
