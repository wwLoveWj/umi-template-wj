declare namespace API {
  interface CardListType {
    name: string;
    link: string;
    avatar: string;
    description: string;
    id: number;
    linkId: string;
  }
  interface ApiInfoType {
    APIKey: string;
    APISecret: string;
    APPID: string;
  }
  interface UseInfoType {
    username: string;
    userId: string;
    [propsname: string]: any;
  }
}
