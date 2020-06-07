const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const reload = require('reload');
const rollup = require('rollup');

const rollupConfig = require('../../internals/rollup/rollup.config');

const devBuildDir = path.join(__dirname, '../../devTmp');

function initEnvironment(app) {
  app.use(logger('dev'));
  app.use(express.static(devBuildDir));

  const server = http.createServer(app);

  let watcher;
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

  return {
    scripts: [
      'vaulty-elements.js',
      '/reload/reload.js',
    ],
  };
}

module.exports = {
  initEnvironment,
};
