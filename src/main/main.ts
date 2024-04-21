/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, globalShortcut, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { SerialPort } from 'serialport';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const port = new SerialPort({
  path: 'COM6',
  baudRate: 9600,
  autoOpen: false,
});

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

ipcMain.on('read-serial-sensor', (event, data) => {
  port.open(function (err) {
    if (err) {
      console.log('Error opening port: ', err.message);
    }
    port.write('main screen turn on');
  });
  port.on('data', function (data) {
    // return console.log('Data:', data.toString('ascii'));
    event.sender.send('serial-data', data.toString('ascii'));
  });
})

ipcMain.on('print-something', (event, data) => {
  const rWin = new BrowserWindow({
    show: false,
    webPreferences: {
      // devTools: false,
      nodeIntegration: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  const RESOURCES_PATH_PRINT = app.isPackaged
    ? path.join(
        process.resourcesPath,
        `assets/receipt/print.html`,
      )
    : path.join(
        __dirname,
        `../../assets/receipt/print.html`,
      );

  // rWin.loadFile(RESOURCES_PATH_PRINT);
  rWin.loadURL(RESOURCES_PATH_PRINT).then(() => {
    rWin.webContents.executeJavaScript(`

    document.getElementById('header1').innerText = '${data.header1}';
    document.getElementById('header2').innerText = '${data.header2}';
    document.getElementById('kode-tiket').innerText = '${data.kodeTiket}';
    document.getElementById('tgl-masuk').innerText = '${data.tglMasuk}';
    document.getElementById('tgl-keluar').innerText = '${data.tglKeluar}';
    document.getElementById('durasi').innerText = '${data.durasi}';
    document.getElementById('biaya').innerText = '${data.biaya}';
    document.getElementById('no-kartu').innerText = '${data.noKartu}';
    document.getElementById('bayar-via').innerText = '${data.bayarVia}';
    document.getElementById('sisa-saldo').innerText = '${data.sisaSaldo}';
    document.getElementById('footer1').innerText = '${data.footer1}';
    document.getElementById('footer2').innerText = '${data.footer2}';
    `);

    //berikan delay beberapa detik diisin

    setTimeout(() => {
      rWin.webContents.print({
        silent: true,
        margins: {
          marginType: 'printableArea',
        },
        printBackground: false,
        pagesPerSheet: 1,
        landscape: false,
        header: 'Header of the Page',
        footer: 'Footer of the Page',
        collate: false,
      });
    }, 2000); // Sesuaikan timeout sesuai kebutuhan Anda
  });
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('ico.ico'),
    // autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.setFullScreen(true);
  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// app
//   .whenReady()
//   .then(() => {
//     globalShortcut.register('Alt+F4', () => {
//       console.log('Electron loves global shortcuts!');
//     });
//   })
//   .then(createWindow);
