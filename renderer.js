const { ipcRenderer } = require('electron');

document.getElementById('runGeneral').addEventListener('click', () => {
  ipcRenderer.send('run-bat', 'general.bat');
});

document.getElementById('stopProgram').addEventListener('click', () => {
  ipcRenderer.send('stop-program');
});

ipcRenderer.on('bat-output', (event, output) => {
  const outputElement = document.getElementById('output');
  outputElement.textContent += output + '\n';
});
