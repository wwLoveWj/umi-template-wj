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
  HeartOutlined,
  FileTextOutlined,
  PushpinOutlined,
  CloudUploadOutlined,
  FileImageOutlined,
  ThunderboltOutlined,
  FolderOpenOutlined,
  InstagramOutlined,
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
    key: "DashBoard",
    title: "DashBoard",
    path: "/dash",
    icon: HomeOutlined,
    component: "./dashboard/index",
  },
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
    icon: HeartOutlined,
    routes: [
      {
        path: "/collect",
        hidden: true,
        title: "收藏管理",
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
        title: "文章管理",
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
      {
        key: "comment",
        title: "留言板",
        path: "/article/comment",
        component: "./article/components/Comment.tsx",
        // hidden: true,
      },
    ],
  },
  {
    key: "task",
    title: "任务管理",
    path: "/task",
    icon: BellOutlined,
    routes: [
      // {
      //   path: "/task",
      //   hidden: true,
      //   redirect: "/task/table",
      // },
      {
        key: "task-table",
        hidden: true,
        title: "任务列表",
        path: "/task",
        component: "./task/index",
      },
    ],
  },
  {
    key: "backlog",
    title: "待办管理",
    path: "/backlog",
    icon: PushpinOutlined,
    component: "./backlog/index",
  },
  {
    key: "excel",
    title: "Excel管理",
    path: "/excel",
    icon: FileTextOutlined,
    component: "./excel/index",
  },
  {
    key: "upload",
    title: "文件上传",
    path: "/upload",
    icon: CloudUploadOutlined,
    component: "./upload/index",
  },
  {
    key: "album",
    title: "相册管理",
    path: "/album",
    icon: InstagramOutlined,
    routes: [
      {
        path: "/album",
        hidden: true,
        redirect: "/album/waterfall",
      },
      {
        key: "waterfall",
        title: "瀑布流",
        path: "/album/waterfall",
        component: "./album/waterfall/index",
      },
      {
        key: "elevator",
        title: "电梯导航",
        path: "/album/elevator",
        component: "./album/elevator",
        // hidden: true, //隐藏该菜单项，主要是详情、新增、编辑页
      },
    ],
  },
  {
    key: "website",
    title: "网址管理",
    path: "/website",
    icon: TagsOutlined,
    component: "./websiteSharing",
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
