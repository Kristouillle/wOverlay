const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");

let toolbarWindow;
let imageWindow;

app.on("ready", () => {
  toolbarWindow = new BrowserWindow({
    width: 500,
    height: 60,
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

  // Créer la fenêtre image en tant qu'enfant
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

  // Quand on resize la barre, on update la largeur de l'image
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

function syncImageSize() {
  if (!imageWindow || !toolbarWindow) return;
  const [x, y] = toolbarWindow.getBounds().x
    ? [toolbarWindow.getBounds().x, toolbarWindow.getBounds().y]
    : [0, 0];
  const { width, height } = toolbarWindow.getBounds();

  imageWindow.setBounds({
    x,
    y: y + height, // juste sous la barre
    width,
    height: Math.round(width * (imageWindow.aspect || 0.6))
  });
}
