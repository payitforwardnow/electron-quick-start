// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const log = require('electron-log');//DAM

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//DAM v
const isSecondInstance = app.makeSingleInstance((argv, workingDirectory) => {
  log.log('checking to see if app already running')
  log.log('isSecondInstance? argv,',argv)
  log.log('isSecondInstance? workingDirectory,',workingDirectory)
  deeplinkingUrl = "??";
  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = argv.slice(1)
  }
  log.log('deeplinkingUrl = ' + deeplinkingUrl)
})
if (isSecondInstance) {
  log.log('quitting because app already running')
  app.quit()
}

app.on('will-finish-launching',function(){
  log.log('----------------------- app will-finish-launching -----------------------')
  app.on('open-file', function(event,path){
    log.log('----------------------- app open-file ---------------------------------------',path)
    log.log('file path = ' + path)
    event.preventDefault()
  })
  app.on('open-url', function (event, url) {
    log.log('----------------------- app open-url ---------------------------------------', url)
    if (url.startsWith('/')) {
      url = url.substr(1)
    }
    deeplinkingUrl = url
    log.log('deeplinkingUrl = ' + deeplinkingUrl)
    event.preventDefault()
   })
})
//DAM ^

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
