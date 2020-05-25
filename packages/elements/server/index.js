/* eslint global-require:0 */
const path = require('path');
const express = require('express');

const { config } = require('./config');

const app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

let env;
if (process.env.NODE_ENV === 'development') {
  const { initEnvironment: initDevEnvironment } = require('./envs/dev');
  env = initDevEnvironment(app);
} else {
  const { initEnvironment: initProdEnvironment } = require('./envs/prod');
  env = initProdEnvironment(app);
}

app.get('/', (req, res) => {
  res.render('index', {
    title: 'SDK Elements',
    config: JSON.stringify(config),
    scripts: env.scripts,
  });
});
