// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//DAM v
const log = require('electron-log');
const fs = require('fs')


String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function timestamp(usets){
  function pad(n) {return n<10 ? "0"+n : n}
  d = usets;
  if(typeof d === 'undefined') {
      d = new Date()
  } else if(typeof d === 'string') {
      d = new Date(d)
  } else if(typeof d === 'number') {
      d = new Date(d)
  } else {
      console.log('error unknown type of usets = ' + (typeof usets))
  }
  //console.log('d',d)
  dash="-"
  colon=":"
  return d.getFullYear()+dash+
  pad(d.getMonth()+1)+dash+
  pad(d.getDate())+' '+
  pad(d.getHours())+colon+
  pad(d.getMinutes())+colon+
  pad(d.getSeconds())
}



var logpath
if(process.platform === 'darwin') {
    //from  ~/Library/Logs/<app name>/log.log
    //to    ~/Library/Logs/<app name>/yyyy-mm-dd hh.mm.ss.log
    logpath = app.getPath('home') + '/Library/Logs/' + app.getName() 
    if(!fs.existsSync(logpath)) {
        console.log('dbg making folder ' + logpath)
        fs.mkdirSync(logpath)
    }
    logpath += '/' + (timestamp().replaceAll(':','.')) + '.log';
} else {
    //from  %USERPROFILE%\AppData\Roaming\<app name>\log.log
    //to    %USERPROFILE%\AppData\Roaming\<app name>\logs\yyyy-mm-dd hh.mm.ss.log
    logpath = app.getPath('userData') + '\\logs'
    if(!fs.existsSync(logpath)) {
        console.log('dbg making folder ' + logpath)
        fs.mkdirSync(logpath)
    }
    logpath += '\\' +  (timestamp().replaceAll(':','.')) + '.log'
}
console.log('dbg logpath = ' + logpath)
log.transports.file.file = logpath
console.log('dbg log.transports.file.file = ' + log.transports.file.file)

log.transports.file.level = 'silly';//'info'

const isSecondInstance = app.makeSingleInstance((argv, workingDirectory) => {
  log.info('checking to see if app already running')
  log.info('isSecondInstance? argv,',argv)
  log.info('isSecondInstance? workingDirectory,',workingDirectory)
  deeplinkingUrl = "??";
  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = argv.slice(1)
  }
  sendAndLogMsg('deeplinkingUrl = ' + deeplinkingUrl)
})

if (isSecondInstance) {
  sendAndLogMsg('quitting because app already running')
  app.quit()
}
let openedfile = "???"
app.on('will-finish-launching',function(){
  setTimeout(function() {
    //mainWindow.webContents.openDevTools();
    sendAndLogMsg('Ready to run some tests');
    if(openedfile !== "???") {
      sendAndLogMsg('App opened using file = ' + openedfile);
    } else {
      sendAndLogMsg('App opened via manual launch');
    }
  },2000)
  log.info('----------------------- app will-finish-launching -----------------------')
  app.on('open-file', function(event,path){
    log.info('----------------------- app open-file ---------------------------------------',path)
    sendAndLogMsg('open-file - ' + path);
    openedfile = path
    event.preventDefault()
  })
  app.on('open-url', function (event, url) {
    log.info('----------------------- app open-url ---------------------------------------', url)
    if (url.startsWith('/')) {
      url = url.substr(1)
    }
    sendAndLogMsg('open-url - ' + url);
    event.preventDefault()
   })
})

function sendAndLogMsg(msg) {
  log.info(msg)
  console.log(msg)
  if(mainWindow) {
    //let code = 'alert("' + msg + '");';
    let code = 'var elem = document.createElement("div");'
    code += 'elem.textContent="' + msg + '";';
    code += 'document.body.appendChild(elem);'
    log.info('executing js - ' + code);
    mainWindow.webContents.executeJavaScript(code);
  }
}
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
