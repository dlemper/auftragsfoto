"use strict";

import { app, protocol, ipcMain, dialog } from "electron"; // , BrowserWindow
// import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { TrayMenu } from "@/electron/TrayMenu";
import "@/electron/httpserver";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { getPath } from "./electron/getpath";

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

/*async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});*/

app.on("window-all-closed", (e) => {
  e.preventDefault();
  app.dock.hide();
});

const appElements = {
  tray: null,
  windows: [],
};

app.whenReady().then(() => {
  if (app.dock) app.dock.hide();
  appElements.tray = new TrayMenu();
});

/*const { Menu, Tray } = require('electron')

const getIcon = () => {
  if (systemPreferences.isDarkMode()) return path.resolve(__static, "img", "camera-light.png");;
  return path.resolve(__static, "img", "camera.png");;
};

let tray = null
app.whenReady().then(() => {
  const iconPath=path.resolve(__static, "img", "camera.png");
  tray = new Tray(iconPath)
  tray.setPressedImage(path.join(__static, "img", 'camera-light.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})*/

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.handle("get-config", async () => {
  try {
    return JSON.parse(
      await readFile(path.join(app.getPath("userData"), "config.json"))
    );
  } catch {
    return {
      uploadDir: app.getPath("documents"),
    };
  }
});

ipcMain.handle("set-config", async (_, config) =>
  writeFile(
    path.join(app.getPath("userData"), "config.json"),
    JSON.stringify(config, null, 2)
  )
);

ipcMain.handle("open-dialog", async () => {
  const path = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (path.canceled) {
    throw new Error("was canceled");
  } else {
    return path.filePaths[0];
  }
});
