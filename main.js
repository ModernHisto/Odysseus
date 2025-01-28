const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');

let mainWindow;
let winwsProcess = null; // Хранит PID и процесс

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function getZapretPath() {
  // Если приложение упаковано (после сборки), используем путь к ресурсам
  if (process.resourcesPath) {
    return path.join(process.resourcesPath, 'zapret-discord-youtube');
  }
  // В режиме разработки используем обычный путь
  return path.join(__dirname, 'zapret-discord-youtube');
}

function runBatFile(batFileName) {
  if (winwsProcess && winwsProcess.process) {
    console.log('Killing existing process...');
    winwsProcess.process.kill();
    winwsProcess = null;
  }

  const zapretPath = getZapretPath();
  const batPath = path.join(zapretPath, batFileName);
  console.log('Attempting to spawn:', batPath);

  const batProcess = spawn('cmd.exe', ['/c', batPath], {
    stdio: 'pipe',
    shell: true,
    detached: true,
  });

  winwsProcess = {
    pid: null,
    process: batProcess,
  };

  batProcess.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
    mainWindow.webContents.send('bat-output', data.toString());
  });

  batProcess.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
    mainWindow.webContents.send('bat-output', data.toString());
  });

  batProcess.on('close', code => {
    console.log(`child process exited with code ${code}`);
    mainWindow.webContents.send(
      'bat-output',
      `Process exited with code ${code}`
    );
  });

  setTimeout(() => {
    exec('tasklist /FI "IMAGENAME eq winws.exe"', (error, stdout, stderr) => {
      if (error) {
        console.error('Error finding winws.exe:', error);
        mainWindow.webContents.send('bat-output', 'Error finding winws.exe');
        return;
      }

      const lines = stdout.split('\n');
      if (lines.length >= 4) {
        const processLine = lines[3];
        const pid = processLine.split(/\s+/)[1];
        if (pid && !isNaN(pid)) {
          console.log('Found winws.exe with PID:', pid);
          winwsProcess.pid = parseInt(pid, 10);
          mainWindow.webContents.send(
            'bat-output',
            `Found winws.exe with PID: ${pid}`
          );
        } else {
          console.log('winws.exe not found or invalid PID');
          mainWindow.webContents.send(
            'bat-output',
            'winws.exe not found or invalid PID'
          );
        }
      } else {
        console.log('winws.exe not found');
        mainWindow.webContents.send('bat-output', 'winws.exe not found');
      }
    });
  }, 5000);
}

function stopProgram() {
  if (winwsProcess) {
    console.log('Stopping winws.exe with PID:', winwsProcess.pid);

    exec(
      `tasklist /FI "PID eq ${winwsProcess.pid}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error('Error checking process:', error);
          mainWindow.webContents.send('bat-output', 'Error checking process');
          return;
        }

        if (stdout.includes('winws.exe')) {
          exec(
            `taskkill /PID ${winwsProcess.pid} /F`,
            (error, stdout, stderr) => {
              if (error) {
                console.error('Error stopping winws.exe:', error);
                mainWindow.webContents.send(
                  'bat-output',
                  'Failed to stop winws.exe'
                );
              } else {
                console.log('winws.exe stopped:', stdout);
                mainWindow.webContents.send('bat-output', 'winws.exe stopped');
              }
            }
          );
        } else {
          console.log('winws.exe not found');
          mainWindow.webContents.send('bat-output', 'winws.exe not found');
        }
      }
    );
  } else {
    console.log('No winws.exe process to stop');
    mainWindow.webContents.send('bat-output', 'No winws.exe process running');
  }
}

ipcMain.on('run-bat', (event, batFileName) => {
  runBatFile(batFileName);
});

ipcMain.on('stop-program', () => {
  stopProgram();
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
