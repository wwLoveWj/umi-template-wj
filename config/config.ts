import { defineConfig } from "umi";
import routes from "../src/routes";
import { PROJECT_CONFIG } from "../src/constants/constant";

export default defineConfig({
  title: "创世纪系统",
  mountElementId: PROJECT_CONFIG.NAME,
  // history: { type: "hash" },
  // initialState: {},
  // model: {}, // 使用useModel需要这个配置
  // locale: {},
  // icons: {},
  // mfsu默认开启，需要开启按需加载 extraBabelPlugins，注意！！在本地qiankun下调试的时候需要关闭按需加载
  // mfsu: fasle,
  // modifyVars: {
  //   // hack: 'true; @import "~@/styles/common.less";',
  //   "@ant-prefix": PROJECT_CONFIG.NAME + "-ant", // ant前缀 样式隔离
  //   /* 自定义less变量 */
  //   "@define-prefix": PROJECT_CONFIG.NAME,
  //   "@prefix": PROJECT_CONFIG.NAME,
  // },
  // qiankun: {
  //   slave: {},
  // },
  routes,
  // 配置别名，对引用路径进行映射。
  alias: {
    "@utils": "/src/utils",
    "@assets": "/src/assets",
    "@service": "/src/service",
  },
  plugins: [
    "@umijs/plugins/dist/initial-state",
    "@umijs/plugins/dist/model",
    // "@umijs/plugins/dist/locale",
    // "umi-plugin-keep-alive",
  ],
});
