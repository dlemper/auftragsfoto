import {
  app,
  Tray,
  Menu,
  nativeImage,
  shell,
  BrowserWindow,
  nativeTheme,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import os from "os";
import path from "path";
import { getPath } from "./getpath";

export class TrayMenu {
  constructor() {
    //this.iconPath = path.resolve(__static, "img", "camera.png");

    const image = nativeImage.createFromPath(this.getIcon());
    image.setTemplateImage(true);

    const addrs = [
      os.hostname(),
      ...Object.values(os.networkInterfaces())
        .flat()
        .filter((n) => !n.internal)
        .map((n) => n.address),
    ];

    this.tray = new Tray(image);
    this.tray.setPressedImage(path.join(__static, "img", "camera-light.png"));
    this.tray.setToolTip("Auftragsfoto");

    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        ...addrs.map((n) => ({
          label: `http://${n}:3000/`,
          type: "normal",
          click: () => {
            shell.openExternal(`http://${n}:3000/`);
          },
        })),
        {
          type: "separator",
        },
        {
          label: "Ordner öffnen",
          type: "normal",
          click: async () => shell.openPath(await getPath()),
        },
        {
          label: "Einstellungen",
          type: "normal",
          click: async () => {
            const image = nativeImage.createFromPath(this.getIcon());
            image.setTemplateImage(true);

            const window = new BrowserWindow({
              width: 600,
              height: 148,
              show: true,
              webPreferences: {
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
                preload: path.join(__dirname, "preload.js"),
              },
              autoHideMenuBar: true,
              icon: image,
            });

            if (process.env.WEBPACK_DEV_SERVER_URL) {
              // Load the url of the dev server if in development mode
              await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
              if (!process.env.IS_TEST) window.webContents.openDevTools();
            } else {
              createProtocol("app");
              // Load the index.html when not in development
              window.loadURL("app://./index.html");
            }
          },
        },
        {
          type: "separator",
        },
        {
          label: "Beenden",
          type: "normal",
          click: () => app.quit(),
        },
      ])
    );
  }

  getIcon() {
    if (nativeTheme.shouldUseDarkColors)
      return path.resolve(__static, "img", "camera-light.png");
    return path.resolve(__static, "img", "camera.png");
  }
}
