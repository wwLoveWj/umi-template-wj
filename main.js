// electron/main.js
const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  screen,
} = require("electron");
const path = require("path");
const NODE_ENV = process.env.NODE_ENV;
let mainWindow, cutWindow;

function closeCutWindow() {
  cutWindow && cutWindow.close();
  cutWindow = null;
}

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    // ...
  });

  mainWindow.loadURL(
    NODE_ENV === "development"
      ? "http://localhost:8000"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );

  // 打开开发工具
  if (NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    closeCutWindow();
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("OPEN_CUT_SCREEN", async (e) => {
  closeCutWindow();
  mainWindow.hide();
  createCutWindow();
  cutWindow.show();
});

function getSize() {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor,
  };
}

function createCutWindow() {
  const { width, height } = getSize();
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
  if (NODE_ENV === "development") {
    cutWindow.loadURL("http://localhost:8000/#/album/screenshot");
  } else {
    cutWindow.loadFile(path.join(__dirname, "../dist/index.html"), {
      hash: "cut",
    });
  }

  cutWindow.webContents.openDevTools();
  cutWindow.maximize();
  cutWindow.setFullScreen(true);
}

// 作者：jsmask
// 链接：https://juejin.cn/post/7111115472182968327
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
ipcMain.on("SHOW_CUT_SCREEN", async (e) => {
  let sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: getSize(),
  });
  cutWindow.webContents.send("GET_SCREEN_IMAGE", sources[0]);
});
