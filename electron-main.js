const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the browser window. //619
  win = new BrowserWindow({width: 619, height: 581});
  win.setResizable(false);

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/index.html'),
    protocol: 'file:',

    slashes: true
  }));

  // Open the DevTools.
  // win.webContents.openDevTools();
  win.setMenu(null);


  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    app.quit();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);