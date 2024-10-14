import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  PayCircleOutlined,
  OpenAIOutlined,
  TagsOutlined,
  SendOutlined,
  BellOutlined,
  ReadOutlined,
  HomeOutlined,
  AudioOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const menuRoutes: API.MenuRoutesType[] = [
  /**
   * 菜单的配置项，用于动态渲染：
   *  key: 唯一标志
   *  title: 菜单项值（国际化已开启）
   *  path：用于路由跳转
   *  component：组件所在路径，从pages路径下开始
   *  icon：菜单图标
   *  hidden: 是否隐藏该菜单项
   *  routes：子级菜单项
   */
  {
    key: "home",
    title: "首页",
    path: "/home",
    hidden: true,
    icon: HomeOutlined,
    component: "./home/index",
    // routes: [
    //   {
    //     key: "home",
    //     title: "router.home",
    //     path: "/home",
    //     component: "./home/index",
    //   },
    //   {
    //     key: "detail",
    //     title: "router.home.detail",
    //     path: "/home/detail",
    //     component: "./home/Detail",
    //     hidden: true, //隐藏该菜单项，主要是详情、新增、编辑页
    //   },
    // ],
  },
  {
    key: "collect",
    title: "收藏管理",
    path: "/collect",
    icon: HomeOutlined,
    routes: [
      {
        path: "/collect",
        hidden: true,
        redirect: "/collect/table",
      },
      {
        key: "collect",
        title: "收藏列表",
        path: "/collect/table",
        component: "./collect/index",
      },
      // {
      //   key: "detail",
      //   title: "router.home.detail",
      //   path: "/home/detail",
      //   component: "./home/Detail",
      //   hidden: true, //隐藏该菜单项，主要是详情、新增、编辑页
      // },
    ],
  },
  {
    key: "article",
    title: "文章管理",
    path: "/article",
    icon: ReadOutlined,
    // component: "./article/index",
    routes: [
      {
        path: "/article",
        hidden: true,
        redirect: "/article/table",
      },
      {
        key: "table",
        path: "/article/table",
        component: "./article/index",
        title: "文章列表",
      },
      {
        key: "edit",
        title: "更新文章",
        path: "/article/edit",
        component: "./article/components/ArticleCreate.tsx",
        hidden: true,
      },
      {
        key: "create",
        title: "创建文章",
        path: "/article/create",
        component: "./article/components/ArticleCreate.tsx",
        hidden: true,
      },
    ],
  },
  // {
  //   key: "system",
  //   title: "router.system",
  //   path: "/system",
  //   icon: SettingOutlined,
  //   routes: [
  //     {
  //       path: "/system",
  //       hidden: true,
  //       redirect: "/system/system-account",
  //     },
  //     {
  //       key: "system-account",
  //       title: "router.system.account",
  //       path: "/system/system-account",
  //       component: "./system/account/index",
  //     },
  //     {
  //       key: "system-role",
  //       title: "router.system.role",
  //       path: "/system/system-role",
  //       component: "./system/role/index",
  //     },
  //   ],
  // },
];
