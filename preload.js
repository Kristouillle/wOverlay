const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectImage: () => ipcRenderer.invoke("select-image"),
  updateImage: (data) => ipcRenderer.send("update-image", data),
  onSetImage: (callback) => ipcRenderer.on("set-image", (event, data) => callback(data))
});
