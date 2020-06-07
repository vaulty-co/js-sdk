const path = require('path');
const expressStaticGzip = require('express-static-gzip');

const buildDir = path.join(__dirname, '../../build');

function initEnvironment(app) {
  app.use('/', expressStaticGzip(buildDir, {
    enableBrotli: true,
    customCompressions: [{
      encodingName: 'gzip',
      fileExtension: 'gz',
    }],
    orderPreference: ['br', 'gz'],
    index: false,
  }));

  app.use((err, req, res, next) => {
    res.status(500).send('Oops! Something broke!');
    next(err);
  });

  app.listen(app.get('port'), () => {
    console.log(`Web server listening on port ${app.get('port')}`);
  });

  return {
    scripts: [
      'vaulty-elements.min.js',
    ],
  };
}

module.exports = {
  initEnvironment,
};
