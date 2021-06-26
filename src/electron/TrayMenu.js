import { app, Tray, Menu, nativeImage } from "electron";

export class TrayMenu {
  constructor() {
    this.iconPath = "/assets/camera.png";
    this.tray = new Tray(this.createNativeImage());
  }

  createNativeImage() {
    // Since we never know where the app is installed,
    // we need to add the app base path to it.
    const path = `${app.getAppPath()}${this.iconPath}`;
    const image = nativeImage.createFromPath(path);
    // Marks the image as a template image.
    image.setTemplateImage(true);
    return image;
  }

  createMenu() {
    // This method will create the Menu for the tray
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Tokei",
        type: "normal",
        click: () => {
          /* Later this will open the Main Window */
        },
      },
      {
        label: "Quit",
        type: "normal",
        click: () => app.quit(),
      },
    ]);
    return contextMenu;
  }
}
