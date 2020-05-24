const path = require('path');
const express = require('express');

const { config } = require('./config');
const { initEnvironment: initDevEnvironment } = require('./envs/dev');
const { applyMiddleware: initProdEnvironment } = require('./envs/prod');

const app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

let env;
if (process.env.NODE_ENV === 'development') {
  env = initDevEnvironment(app);
} else {
  env = initProdEnvironment(app);
}

app.get('/', (req, res) => {
  res.render('index', {
    title: 'SDK Elements',
    config: JSON.stringify(config),
    scripts: env.scripts,
  });
});
