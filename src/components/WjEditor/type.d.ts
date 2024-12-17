export interface CatalogueType {
  level: number;
  id: string;
  text: string | null;
  index: number;
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
}
