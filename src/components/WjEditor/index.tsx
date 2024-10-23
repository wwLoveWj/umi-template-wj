import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/core";
// ------------websocket的创建关闭及心跳应答--------------------
import {
  createWebSocket,
  closeWebSocket,
  // websocket,
  websocketMsgHandler,
} from "./websocket";
import { useRequest } from "ahooks";
import {
  ArticleInfoCreateAPI,
  ArticleInfoUpdateAPI,
  ArticleInfoDetailsAPI,
} from "@/service/api/article";
import React, { useState, useEffect } from "react";
import { Button, Affix, Tooltip } from "antd";
import { history } from "umi";
import _ from "lodash-es";
// 获取锚点、目录等公共方法
import {
  generateTableOfContents,
  addAnchorLinks,
  handleItemClick,
  getAllHtagList,
} from "./catalogue";
import { guid } from "@/utils";
import styles from "./style.less";
import "./style.less";
import type { EditorTxtType, CatalogueType, Iprops } from "./type";

function MyEditor({ detailsFromProps }: { detailsFromProps: Iprops }) {
  //------------------------- 编辑器相关配置----------------------------------
  const [editor, setEditor] = useState<IDomEditor | null>(null); // editor 实例
  const [html, setHtml] = useState(""); // 编辑器内容
  const [title, setTitle] = useState(""); //文章标题
  // 左侧锚点集合
  const [tableOfContents, setTableOfContents] = useState<CatalogueType[]>([]); //目录结构集合
  const [activeIndex, setActiveIndex] = useState<number>(0); //设置当前选中的index
  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
  };
  // ---------------------------外部使用时传递的参数-----------------------------
  // const detailsData = (useLocation() as any).state;
  const { editorId, isRealTimeediting = true }: Iprops = detailsFromProps;
  const isEditMode = !!editorId;
  //   获取编辑器信息
  const searchEditorTxtApi = useRequest(
    () => ArticleInfoDetailsAPI({ editorId }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: (res: EditorTxtType[]) => {
        // editor.restoreSelection(); //恢复选区
        setHtml(res[0]?.editorContent);
        setTitle(res[0]?.title);
        editorConfig.readOnly = true;
        editor && editor.focus(true);
      },
    }
  );

  // 编辑器的数据保存提交事件
  const saveEditorContent = async () => {
    if (editor) {
      // 将获取到的数据回显
      setHtml(editor.getHtml());
      !isEditMode
        ? await ArticleInfoCreateAPI({
            editorKey: "editor-add",
            editorId: guid(),
            title: title || "默认title",
          })
        : await ArticleInfoUpdateAPI({
            editorKey: editorId,
            editorId,
            title,
          });
      history.push("/article/table");
    }
  };
  const changeEditorDB = _.debounce(saveEditorContent, 10000);

  // 标题的输入事件
  const changeEditorTitle = () => {
    websocketMsgHandler(
      JSON.stringify({
        editorContent: editor?.getHtml(),
        editorKey: !isEditMode ? "editor-add" : editorId,
        title,
        // action,//TODO: 编辑器操作类型，用于判断是否更新数据库
      })
    );
  };
  const changeEditorTitleWs = _.debounce(changeEditorTitle, 6000);

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

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
    };
  }, []);

  return (
    <>
      {/* =================文章标题================== */}
      <div className="user-box">
        {/* <div id="typing">55555555555555</div> */}
        <input
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            changeEditorTitleWs();
          }}
        />
        <Button type="primary" onClick={saveEditorContent}>
          更新
        </Button>
      </div>
      <div className={styles.allInfo}>
        {/* =============编辑器部分================== */}
        <div
          style={{ border: "1px solid #ccc", zIndex: 100 }}
          className="content"
        >
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: "1px solid #ccc" }}
          />
          <Editor
            defaultConfig={editorConfig}
            value={html}
            onCreated={setEditor}
            onChange={(editor: IDomEditor) => {
              // 定义好所有的锚点结构
              setTableOfContents(generateTableOfContents());
              addAnchorLinks();
              if (isRealTimeediting) {
                websocketMsgHandler(
                  JSON.stringify({
                    editorContent: editor.getHtml(),
                    editorKey: !isEditMode ? "editor-add" : editorId,
                    title,
                    // action,
                  })
                );
              }
            }}
            mode="default"
            style={{ height: "500px", overflowY: "hidden" }}
          />
        </div>
        {/* =============右侧目录部分================ */}
        <Affix offsetTop={180} className={styles.catalogue}>
          <div className="table-of-title">
            <span>目录</span>
          </div>
          <ul className="table-of-contents">
            {tableOfContents.map((item, index) => {
              return (
                <li
                  key={item.id}
                  style={{ paddingLeft: item.level * 20 + "px" }}
                >
                  <a
                    className={activeIndex === index ? "active" : ""}
                    href={`#${item.id}`}
                    onClick={() => {
                      setActiveIndex(index);
                      handleItemClick(index);
                    }}
                  >
                    <Tooltip title={item.text} color="lime" placement="leftTop">
                      {item.text}
                    </Tooltip>
                  </a>
                </li>
              );
            })}
          </ul>
        </Affix>
      </div>
    </>
  );
}

export default MyEditor;
