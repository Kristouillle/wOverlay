const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectImage: () => ipcRenderer.invoke("select-image"),
  updateImage: (data) => ipcRenderer.send("update-image", data),
  togglePixelate: (state) => ipcRenderer.send("toggle-pixelate", state),
  setPixelSize: (size) => ipcRenderer.send("set-pixel-size", size),
  closeApp: () => ipcRenderer.send("close-app"),
  onSetImage: (callback) => ipcRenderer.on("set-image", (event, data) => callback(data)),
  onTogglePixelate: (callback) => ipcRenderer.on("toggle-pixelate", (event, state) => callback(state)),
  onPixelSize: (callback) => ipcRenderer.on("set-pixel-size", (event, size) => callback(size))
});
