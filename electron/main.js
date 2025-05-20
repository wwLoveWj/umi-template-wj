// electron/main.js
const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  screen,
  globalShortcut,
  Tray,
  Menu,
  nativeImage,
  MenuItem,
} = require("electron");
const path = require("path");
const fs = require("fs");
const singleThreadOCR = require("./singleThread_js/singleThread"); //识图
const {
  createShotScreenWin,
  closeShotScreenWin,
  openShotScreenWin,
  showShotScreenWin,
  hideShotScreenWin,
  minimizeShotScreenWin,
  maximizeShotScreenWin,
  unmaximizeShotScreenWin,
  downloadURLShotScreenWin,
} = require("./utils");
const NODE_ENV = process.env.NODE_ENV;
let mainWindow, cutWindow, viewImageWin;

function closeCutWindow() {
  cutWindow && cutWindow.close();
  cutWindow = null;
}

let tray = null; // 在外面创建tray变量，防止被自动删除，导致图标自动消失
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,

      // nodeIntegration: false,
      // contextIsolation: true,
      // preload: path.join(__dirname, "preload.js"),
    },
  });

  // 开发环境下加载本地服务
  // if (process.env.NODE_ENV === "development") {
  win.loadURL("http://localhost:8000");
  win.webContents.openDevTools();
  // } else {
  //   // 生产环境下加载打包后的文件
  //   win.loadFile(path.join(__dirname, "../dist/index.html"));
  // }
  // 创建任务栏图标
  tray = new Tray(
    path.resolve(
      __dirname,
      "/coding/20240320ww/my-umi-app/umi-template-wj/src/assets/imgs/flower.png"
    )
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "截图",
      type: "radio",
      click: () => {
        if (mainWindow) {
          closeShotScreenWin();
          mainWindow.hide();
          openShotScreenWin();
        }
      },
    },
    {
      label: "关闭",
      type: "radio",
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      },
    },
    {
      label: "退出",
      click: async function () {
        // dbugger;
        // console.log(123);
        // win.destroy();
        app.quit();
        // win = null;
      },
    },
    { label: "关于", type: "radio", checked: true },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("欢迎访问创世纪系统~");
  tray.setTitle("创世纪系统");
  // 点击托盘图标，显示主窗口
  tray.on("click", () => {
    win.show();
  });

  win.on("closed", (e) => {
    closeCutWindow();
    // e.preventDefault(); // 阻止退出程序
    // win.setSkipTaskbar(true); // 取消任务栏显示
    // win.hide(); // 隐藏主程序窗口
    //回收BrowserWindow对象
    if (win.isMinimized()) {
      win = null;
    } else {
      e.preventDefault();
      win.minimize();
    }
  });

  mainWindow = win; // 将创建的窗口赋值给 mainWindow
  return win;
}

app.whenReady().then(() => {
  mainWindow = createWindow();

  // 注册右下角的托盘图标
  // const icon = nativeImage.createFromPath("../src/assets/imgs/flower.png");
  // tray = new Tray(icon);

  // 全局快捷键
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Electron",
      submenu: [
        {
          role: "截屏",
          accelerator:
            process.platform === "darwin" ? "Alt+Cmd+I" : "Alt+Shift+I",
          click: () => {
            if (mainWindow) {
              closeShotScreenWin();
              mainWindow.hide();
              openShotScreenWin();
            }
          },
        },
      ],
    })
  );
  Menu.setApplicationMenu(menu);
  // 注册全局快捷键
  globalShortcut.register("CommandOrControl+Shift+A", () => {
    if (mainWindow) {
      // mainWindow.webContents.send("ss:open-win");
      closeShotScreenWin();
      mainWindow.hide();
      openShotScreenWin();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 在应用退出时注销快捷键
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("OPEN_CUT_SCREEN", async (e) => {
  closeCutWindow();
  mainWindow.hide();
  createCutWindow();
  cutWindow.show();
});
ipcMain.on("OPEN_CUT_SCREEN1", () => {
  closeCutWindow();
});
function getScreenSize() {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor,
  };
}

function createCutWindow() {
  const { width, height } = getScreenSize();
  cutWindow = new BrowserWindow({
    title: "pear-rec 截屏",
    icon: path.join(PUBLIC, "logo@2x.ico"),
    width, // 宽度(px), 默认值为 800
    height, // 高度(px), 默认值为 600
    autoHideMenuBar: true, // 自动隐藏菜单栏
    useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
    movable: false, // 是否可移动
    frame: false, // 无边框窗口
    resizable: false, // 窗口大小是否可调整
    hasShadow: false, // 窗口是否有阴影
    transparent: true, // 使窗口透明
    fullscreenable: true, // 窗口是否可以进入全屏状态
    fullscreen: true, // 窗口是否全屏
    simpleFullscreen: true, // 在 macOS 上使用 pre-Lion 全屏
    alwaysOnTop: false, // 窗口是否永远在别的窗口的上面
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // if (process.env.NODE_ENV === "development") {
  cutWindow.loadURL("http://localhost:8000/#/album/screenshot");
  cutWindow.webContents.openDevTools();
  // } else {
  //   cutWindow.loadFile(path.join(__dirname, "../dist/index.html"), {
  //     hash: "screenshot",
  //   });
  // }
  cutWindow.maximize();
  cutWindow.setFullScreen(true);
}

// 监听截图完成
ipcMain.on("GET_CUT_INFO", (event, imageData) => {
  console.log("GET_CUT_INFO--------------", imageData);
  debugger;
  if (mainWindow) {
    mainWindow.webContents.send("GET_CUT_INFO", imageData);
  }
  if (cutWindow) {
    cutWindow.close();
  }
});

// 作者：jsmask
// 链接：https://juejin.cn/post/7111115472182968327
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
ipcMain.on("SHOW_CUT_SCREEN", async (e) => {
  let sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: getScreenSize(),
  });
  cutWindow.webContents.send("GET_SCREEN_IMAGE", sources[0]);
});

// 处理文件系统操作
ipcMain.handle("check-file-exists", async (event, filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error("检查文件存在失败:", error);
    return false;
  }
});

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("读取文件失败:", error);
    throw error;
  }
});

ipcMain.handle("write-file", async (event, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    return true;
  } catch (error) {
    console.error("写入文件失败:", error);
    throw error;
  }
});

// 截图
ipcMain.handle("ss:get-shot-screen-img", async () => {
  const { width, height } = getScreenSize();
  const sources = [
    ...(await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width,
        height,
      },
    })),
  ];
  const source = sources.filter((e) => e.id == "screen:0:0")[0];
  const img = source.thumbnail.toDataURL();
  return img;
});

ipcMain.on("ss:open-win", () => {
  closeShotScreenWin();
  mainWindow.hide();
  openShotScreenWin();
});

ipcMain.on("ss:close-win", () => {
  closeShotScreenWin();
});

ipcMain.on("ss:save-img", async (e, downloadUrl) => {
  downloadURLShotScreenWin(downloadUrl);
  await openViewImageWin(downloadUrl);
});

ipcMain.on("ss:download-img", async (e, downloadUrl) => {
  downloadURLShotScreenWin(downloadUrl, true);
});

ipcMain.handle("ss:get-desktop-capturer-source", async () => {
  return [
    ...(await desktopCapturer.getSources({ types: ["screen"] })),
    ...(await selfWindws()),
  ];
});

/**
 * 打开图片查看窗口
 * @param {string} imageUrl - 图片URL（可以是 Blob URL 或文件路径）
 */
async function openViewImageWin(imageUrl) {
  if (viewImageWin) {
    viewImageWin.close();
  }

  viewImageWin = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // 允许加载本地资源
      // backgroundThrottling: false, // 禁用背景节流
      // enableRemoteModule: true, // 启用远程模块
      // partition: "persist:view-image", // 使用持久化的会话分区
    },
  });

  // 在加载新页面时清除缓存
  // viewImageWin.webContents.session.clearCache();

  // 开发环境下加载本地服务
  viewImageWin.loadURL(
    `http://localhost:8000/#/album/view-image?path=${encodeURIComponent(
      imageUrl
    )}`
  );
  // ======================识别图片=======================
  const len = imageUrl?.split("/");
  await singleThreadOCR({
    targetPhotoDir: path.join(
      __dirname,
      "./public/" + `${len[len?.length - 1]}.png`
    ),
    // targetPhotoDir: imgUrl,
    languages: "chi_sim+eng",
    targetPath: path.join(__dirname, "./upload/"),
  });
  // =====================================================
  viewImageWin.webContents.openDevTools();
  viewImageWin.on("closed", () => {
    viewImageWin = null;
  });
}

// 监听打开图片查看窗口的请求
ipcMain.on("OPEN_VIEW_IMAGE", (event, imagePath) => {
  openViewImageWin(imagePath);
});

// 监听关闭图片查看窗口的请求
ipcMain.on("CLOSE_VIEW_IMAGE", () => {
  if (viewImageWin) {
    viewImageWin.close();
  }
});
