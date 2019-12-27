const express = require('express');
const http = require('http');
const path = require('path');
const reload = require('reload');
const bodyParser = require('body-parser');
const logger = require('morgan');
const rollup = require('rollup');
const rollupConfig = require('../internals/rollup/rollup.config');

const app = express();
const rootDir = __dirname;
const buildDir = path.join(__dirname, '../build');

app.set('port', process.env.PORT || 3001);
app.use(express.static(buildDir));
app.use(logger('dev'));
app.use(bodyParser.json()); // Parses json, multi-part (file), url-encoded

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

const server = http.createServer(app);
let watcher;

// Reload code here
reload(app).then((reloadReturned) => {
  watcher = rollup.watch(rollupConfig);

  watcher.on('event', (event) => {
    if (event.code === 'END') {
      // Fire server-side reload event
      reloadReturned.reload();
    }
  });

  // Reload started, start web server
  server.listen(app.get('port'), () => {
    console.log(`Web server listening on port ${app.get('port')}`);
  });
}).catch((err) => {
  console.error('Reload could not start, could not start server/sample app', err);
});

server.on('close', () => {
  // stop watching
  if (watcher) {
    watcher.close();
  }
});
