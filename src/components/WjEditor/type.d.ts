import { IDomEditor } from "@wangeditor/core";

/**
 * 编辑器属性类型
 */
export interface EditorProps {
  editorId?: string;
  isRealTimeediting?: boolean;
  disabled?: boolean;
}

/**
 * 目录项类型
 */
export interface CatalogueType {
  id: string;
  level: number;
  text: string;
}

/**
 * 编辑器状态类型
 */
export interface EditorState {
  editor: IDomEditor | null;
  html: string;
  title: string;
  tableOfContents: CatalogueType[];
  activeIndex: number;
}

/**
 * WebSocket 消息类型
 */
export interface WebSocketMessage {
  editorContent: string;
  editorKey: string;
  title: string;
  isEditMode: boolean;
}

export interface Iprops {
  isComment?: boolean; //是否属于评论组件
  editorId?: string;
  isRealTimeediting?: boolean; //是否开启websocket监听消息
  disabled?: boolean; //是否禁用编辑器
  children?: ReactDOM; //标题节点插入dom
  changeEditorContentWs: (editor: IDomEditor) => void; //编辑器内容的change事件
  editorHtml: any; //编辑器html节点
  changeEditorTitleWs?: (val: string, editor: IDomEditor) => void; //编辑器标题的change事件
  editorTitle?: string; //编辑器标题
}

export interface TitleEditorProps {
  editorId: string;
  isRealTimeediting?: boolean; //是否开启websocket监听消息
  disabled?: boolean;
  saveEditorContent: () => void; //文章保存按钮
  cancelEditorBtn: () => void; //取消按钮
  title?: string; //默认标题
  onChgTitle: (val: string) => void;
  editorHtml: string; //编辑器内容区
  onImgBg: (imgSrc: string) => void; //上传文章背景图
  imgSrc: string;
}

export interface headListType {
  text: string;
  type: string;
  children?: any;
  id: string;
  level?: number;
}
