// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, app, ipcRenderer, IpcRendererEvent } from 'electron';
import path from 'path';
const { exec } = require('child_process');
const Stream = require('node-rtsp-stream');
const { Client } = require('basic-ftp');
export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    // async sendFTP(data: any) {
    //   const client = new Client();
    //   client.ftp.verbose = true;
    //   try {
    //     const pathsnapshot =
    //     process.env.NODE_ENV === 'development'
    //       ? path.join(__dirname, '../../assets/capture') // Untuk mode pengembangan
    //       : path.join(process.resourcesPath, 'assets/capture'); // Untuk aplikasi yang sudah dipaket
    //     await client.access({
    //       host: `${data.host}`,
    //       user: `${data.user}`,
    //       password: `${data.password}`,
    //       // secure: true,
    //     });
    //     await client.ensureDir(`${data.dirRremote}`);
    //     await client.uploadFrom(`${pathsnapshot}/${data.nameFileLocal}`, `${data.nameFileRemote}`);
    //     // await client.downloadTo(`${data.dirLocal}`, `${data.dirRemote}`);
    //   } catch (err) {
    //     console.log('yaa error', err);
    //   }
    //   client.close();
    // },

    // captureIPCame(data: any) {
    //   const pathsnapshot =
    //     process.env.NODE_ENV === 'development'
    //       ? path.join(__dirname, '../../assets/capture') // Untuk mode pengembangan
    //       : path.join(process.resourcesPath, 'assets/capture'); // Untuk aplikasi yang sudah dipaket
    //   exec(
    //     `"C:/Program Files (x86)/VideoLAN/VLC/vlc.exe" "${data.urlRSTP}" --video-filter scene --scene-format jpg --width 200 --height 200 --scene-prefix ${data.nameFile} --scene-replace --scene-width 1280 --scene-height 720 --scene-path "${pathsnapshot}" --run-time 1 vlc://quit`,
    //     (error: any, stdout: any, stderr: any) => {},
    //   );
    // },

    // closeVLC() {
    //   exec(
    //     `taskkill /im vlc.exe /f`,
    //     (error: any, stdout: any, stderr: any) => {},
    //   );
    // },

    // readSensor() {
    //   ipcRenderer.send('read-serial-sensor');
    // },

    // onSerialData(callback: (data: string) => void) {
    //   ipcRenderer.on('serial-data', (_event, data) => {
    //     callback(data);
    //   });
    // },

    // controlRelay(data: any) {
    //   const pathdeductapp =
    //     process.env.NODE_ENV === 'development'
    //       ? path.join(__dirname, '../../assets/relay/relay-control.exe') // Untuk mode pengembangan
    //       : path.join(process.resourcesPath, 'assets/relay/relay-control.exe'); // Untuk aplikasi yang sudah dipaket
    //   const strExecute = `"${pathdeductapp}" ${data}`;
    //   return new Promise((resolve, reject) => {
    //     exec(
    //       `${strExecute}`,
    //       // 'wmic baseboard get serialnumber',
    //       (error: any, stdout: any, stderr: any) => {
    //         if (error) {
    //           reject(error);
    //           return;
    //         }
    //         if (stderr) {
    //           reject(stderr);
    //           return;
    //         }
    //         const serial = stdout.trim();
    //         resolve(serial);
    //       },
    //     );
    //   });
    // },

    // sendRequestReader(
    //   data: any = {
    //     tipe: 'get_last_transaction',
    //   },
    // ) {
    //   if (data.boudrate) {
    //     const pathdeductapp =
    //       process.env.NODE_ENV === 'development'
    //         ? path.join(__dirname, '../../assets/reader/deductConsole.exe') // Untuk mode pengembangan
    //         : path.join(process.resourcesPath, 'assets/reader/deductConsole.exe'); // Untuk aplikasi yang sudah dipaket
    //     const strExecute = `"${pathdeductapp}" --boudrate=${data.boudrate} --com=${data.com} --initkey=${data.initkey} --tipe=${data.tipe} --total=${data.total} --detik=${data.detik}`;
    //     return new Promise((resolve, reject) => {
    //       exec(`${strExecute}`, (error: any, stdout: any, stderr: any) => {
    //         if (error) {
    //           reject(error);
    //           return;
    //         }
    //         if (stderr) {
    //           reject(stderr);
    //           return;
    //         }
    //         const serial = stdout.trim();
    //         resolve(serial);
    //       });
    //     });
    //   }
    // },

    getSerialNumber() {
      return new Promise((resolve, reject) => {
        exec(
          'wmic csproduct get uuid',
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              reject(error);
              return;
            }
            if (stderr) {
              reject(stderr);
              return;
            }
            const serial = stdout.trim();
            resolve(serial);
          },
        );
      });
    },
    getMyConfig() {
      // Tentukan path ke file JSON Anda
      const jsonFilePath =
        process.env.NODE_ENV === 'development'
          ? path.join(__dirname, '../../assets/config/config.json') // Untuk mode pengembangan
          : path.join(process.resourcesPath, 'assets/config/config.json'); // Untuk aplikasi yang sudah dipaket
      // Baca dan parse isi file JSON
      console.log(jsonFilePath);

      const fs = require('fs');
      try {
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        return JSON.parse(jsonContent);
      } catch (err) {
        console.error('Kesalahan membaca berkas JSON:', err);
        return null;
      }
      // ipcRenderer.send('get-config');
    },
    getImage() {
      // Tentukan path ke file JSON Anda
      const jsonFilePath =
        process.env.NODE_ENV === 'development'
          ? path.join(__dirname, '../../assets/images') // Untuk mode pengembangan
          : path.join(process.resourcesPath, 'assets/images'); // Untuk aplikasi yang sudah dipaket
      // Baca dan parse isi file JSON
      return jsonFilePath;
      // ipcRenderer.send('get-config');
      /* background-image: url('./../../../../assets/images/bgimg.jpg'); */
    },
    
    printSomething(data: any) {
      ipcRenderer.send('print-something', data);
    },

    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
