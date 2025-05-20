import { menuRoutes } from "./menuRoutes";

const routes: API.MenuRoutesType[] = [
  {
    path: "/exception",
    layout: false,
    routes: [
      {
        key: "404",
        path: "/exception/404",
        component: "./exception/404",
      },
      {
        key: "403",
        path: "/exception/403",
        component: "./exception/403",
      },
    ],
  },
  {
    key: "screenshot",
    title: "截图",
    path: "/album/screenshot",
    component: "./cutImage/ScreenShot",
    layout: false,
  },
  {
    key: "view-image",
    title: "图片查看",
    path: "/album/view-image",
    component: "./cutImage/ViewImage",
    layout: false,
  },
  {
    key: "timeline",
    title: "时间线",
    path: "/album/timeline",
    component: "./album/timeline",
    layout: false,
  },
  {
    path: "/login",
    component: "@/pages/login", // 加载login登录页面
    layout: false,
  },
  // {
  //   path: "/register",
  //   component: "@/pages/login/register", // 加载login注册页面
  //   layout: false,
  // },
  // {
  //   path: "/tv",
  //   component: "@/pages/bgTv", // 加载tv开机动画
  //   layout: false,
  // },
  {
    key: "detail",
    title: "文章详情",
    path: "/article/detail",
    component: "./article/components/ArticleDetails.tsx",
    hidden: true,
    layout: false,
  },
  {
    path: "/",
    component: "@/layouts/SecurityLayout", // 主页加载layout公共组件
    layout: false,
    routes: [
      {
        path: "/",
        exact: true,
        hidden: true,
        redirect: "/home",
      },
      ...menuRoutes,
    ],
  },
  {
    path: "*",
    component: "./exception/404",
    redirect: "/exception/404",
    layout: false,
  },
];
export default routes;
export const layout = () => {
  return {
    // 配置路由的title
    title: "后台管理系统",
    // 配置路由的logo
    logo: "/logo.png",
    // 配置路由的菜单
    menu: {
      locale: false,
    },
  };
};
export const request = {
  // 配置请求头
  prefix: "/api",
  // 配置请求头
  headers: { "X-Requested-With": "XMLHttpRequest" },
  // 配置请求参数
  params: {},
  // 配置请求方法
  method: "POST",
  // 配置请求超时时间
  timeout: 10000,
  // 配置跨域请求时是否需要使用凭证
};
