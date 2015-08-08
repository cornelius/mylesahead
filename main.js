var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var expandHomeDir = require('expand-home-dir');

// Report crashes to our server.
require('crash-reporter').start();

require('electron-debug')();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1080, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  readBuckets();

  var file = "mydata.json";
  mainWindow.webContents.on('did-finish-load', function() {
    graphBucket(file);
  });
});

ipc.on('bucket-clicked', function(event, bucket_id) {
  path = expandHomeDir("~/.local/share/myer/buckets/" + bucket_id + ".json");
  graphBucket(path);
});

function readBuckets() {
  path = expandHomeDir("~/.local/share/myer/buckets/");

  var fs = require('fs');
  fs.readdir(path, function(err, files) {
    var buckets = [];

    files.forEach(function(file) {
      if(/\.json$/.test(file)) {
        buckets.push(readBucket(path + file));
      }
    });

    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.send('showBucketList', buckets);
    });
  });
}

function readBucket(file) {
  console.log("READ BUCKET FILE " + file);
  var fs = require('fs');
  var json = {};
  json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return json;
}

function graphBucket(file) {
  var fs = require('fs');
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }

    json = JSON.parse(data);

    mainWindow.webContents.send('show', json);
  });
}
