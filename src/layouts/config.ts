import { loadOml2d } from "oh-my-live2d";

const loadingModel = () => {
  return loadOml2d({
    // ...options
    dockedPosition: "right",
    models: [
      {
        path: "https://registry.npmmirror.com/oml2d-models/latest/files/models/Senko_Normals/senko.model3.json",
        position: [-10, 20],
      },
      {
        path: "https://registry.npmmirror.com/oml2d-models/latest/files/models/Pio/model.json",
        scale: 0.4,
        position: [20, -30],
        stageStyle: {
          height: 300,
        },
      },
      // {
      //   path: "https://model.oml2d.com/HK416-1-normal/model.json",
      //   position: [0, 60],
      //   scale: 0.08,
      //   stageStyle: {
      //     height: 450,
      //   },
      // },
      // {
      //   path: "https://model.oml2d.com/Senko_Normals/senko.model3.json",
      //   position: [-10, 20],
      // },
      // {
      //   path: "https://model.oml2d.com/Pio/model.json",
      //   scale: 0.4,
      //   position: [0, 50],
      //   stageStyle: {
      //     height: 300,
      //   },
      // },
      //   {
      //     path: "https://model.oml2d.com/cat-black/model.json",
      //     scale: 0.15,
      //     position: [0, 20],
      //     stageStyle: {
      //       height: 350,
      //     },
      //   },
      //   {
      //     path: "https://model.oml2d.com/HK416-1-normal/model.json",
      //     position: [0, 60],
      //     scale: 0.08,
      //     stageStyle: {
      //       height: 450,
      //     },
      //   },
    ],
    statusBar: {
      loadingIcon: "icon-loading",
    },
    menus: {
      items: [
        {
          id: "Rest",
          icon: "icon-rest",
          title: "休息",
          onClick(oml2d): void {
            // actions ...
            oml2d.stageSlideOut().then(() => {
              console.log(oml2d.options, "我要滑出去了");
              oml2d.statusBarOpen("看板娘休息中");
              oml2d.setStatusBarClickEvent(() =>
                oml2d.stageSlideIn().then(() => {
                  oml2d.statusBarPopup("加载成功");
                })
              );
            });
          },
        },
        {
          id: "SwitchModel",
          icon: "icon-switch",
          title: "切换模型",
          onClick(oml2d): void {
            // 加载下一个模型
            oml2d.loadNextModel().then(() => {
              oml2d.statusBarPopup("切换成功");
            });
          },
        },
      ],
    },
  });
};
export default loadingModel;
