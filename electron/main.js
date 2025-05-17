// electron/main.js
const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  screen,
  globalShortcut,
} = require("electron");
const path = require("path");
const fs = require("fs");
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

  win.on("closed", () => {
    closeCutWindow();
  });

  mainWindow = win; // 将创建的窗口赋值给 mainWindow
  return win;
}

app.whenReady().then(() => {
  mainWindow = createWindow();

  // 注册全局快捷键
  globalShortcut.register("CommandOrControl+Shift+A", () => {
    if (mainWindow) {
      mainWindow.webContents.send("OPEN_CUT_SCREEN");
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
function openViewImageWin(imageUrl) {
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
    },
  });

  // 开发环境下加载本地服务
  viewImageWin.loadURL(
    `http://localhost:8000/#/album/view-image?path=${encodeURIComponent(
      imageUrl
    )}`
  );
  // viewImageWin.webContents.openDevTools();

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
