const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");

let toolbarWindow;
let imageWindow;

app.on("ready", () => {
  toolbarWindow = new BrowserWindow({
    width: 500,
    height: 60,
    minHeight: 60,
    maxHeight: 60, // empêche resize vertical
    frame: false,
    transparent: false,
    resizable: true,
    alwaysOnTop: true,
    backgroundColor: "#202020",
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  toolbarWindow.loadFile("toolbar.html");

  imageWindow = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    parent: toolbarWindow,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  imageWindow.setIgnoreMouseEvents(true, { forward: true });
  imageWindow.loadFile("image.html");

  toolbarWindow.on("resize", syncImageSize);
  toolbarWindow.on("move", syncImageSize);
});

ipcMain.handle("select-image", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }]
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.on("update-image", (event, data) => {
  imageWindow.webContents.send("set-image", data);
  imageWindow.aspect = data.aspect;
  syncImageSize();
});

ipcMain.on("toggle-pixelate", (event, enabled) => {
  imageWindow.webContents.send("toggle-pixelate", enabled);
});

ipcMain.on("set-pixel-size", (event, size) => {
  imageWindow.webContents.send("set-pixel-size", size);
});


ipcMain.on("close-app", () => {
  app.quit();
});

function syncImageSize() {
  if (!imageWindow || !toolbarWindow) return;
  const [x, y] = [toolbarWindow.getBounds().x, toolbarWindow.getBounds().y];
  const { width, height } = toolbarWindow.getBounds();

  imageWindow.setBounds({
    x,
    y: y + height,
    width,
    height: Math.round(width * (imageWindow.aspect || 0.6))
  });
}
