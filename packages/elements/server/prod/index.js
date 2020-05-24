const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const rootDir = __dirname;
const buildDir = path.join(__dirname, '../../build');

app.set('port', process.env.PORT || 3001);
app.use(express.static(buildDir));
app.use(bodyParser.json()); // Parses json, multi-part (file), url-encoded

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(app.get('port'), () => {
  console.log(`Web server listening on port ${app.get('port')}`);
});
