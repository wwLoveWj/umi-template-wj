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
    width,
    height,
    autoHideMenuBar: true,
    useContentSize: true,
    movable: false,
    frame: false,
    resizable: false,
    hasShadow: false,
    transparent: true,
    fullscreenable: true,
    fullscreen: true,
    simpleFullscreen: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (NODE_ENV === "development") {
    cutWindow.loadURL("http://localhost:8000/screenshot");
  } else {
    cutWindow.loadFile(path.join(__dirname, "../dist/index.html"), {
      hash: "cut",
    });
  }
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
