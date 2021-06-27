import { app, Tray, Menu, nativeImage, shell } from "electron";
import os from "os";
import path from "path";

export class TrayMenu {
  constructor() {
    this.iconPath = path.resolve(__static, 'img', 'icons', 'favicon-16x16.png');

    const image = nativeImage.createFromPath(this.iconPath);
    image.setTemplateImage(true);

    const addrs = [
      os.hostname(),
      ...Object
        .values(os.networkInterfaces())
        .flat()
        .filter(n => !n.internal)
        .map(n => n.address)
    ];

    this.tray = new Tray(image);

    this.tray.setContextMenu(Menu.buildFromTemplate([
      ...addrs.map(n => ({
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
        click: () => app.quit(),
      },
      {
        label: "Einstellungen",
        type: "normal",
        click: () => app.quit(),
      },
      {
        type: "separator",
      },
      {
        label: "Beenden",
        type: "normal",
        click: () => app.quit(),
      },
    ]));
  }
}
