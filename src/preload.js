import { contextBridge, ipcRenderer } from "electron";

const validChannels = ["set-config", "get-config", "open-dialog"];

contextBridge.exposeInMainWorld("ipcRenderer", {
  invoke: (channel, ...args) => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
  },
});
