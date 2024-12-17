export interface CatalogueType {
  level: number;
  id: string;
  text: string | null;
  index: number;
}
export interface Iprops {
  editorId: string;
  isRealTimeediting: boolean; //是否开启websocket监听消息
  disabled?: boolean;
}
