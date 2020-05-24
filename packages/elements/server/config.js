let config;
if (process.env.NODE_ENV === 'production') {
  config = {
    sdkOrigin: process.env.SDK_ORIGIN,
    elementsOrigin: process.env.ELEMENTS_ORIGIN,
    apiOrigin: process.env.API_ORIGIN,
  };
} else {
  config = {
    sdkOrigin: 'http://localhost:3000',
    elementsOrigin: 'http://localhost:3001',
    apiOrigin: 'http://localhost:3001',
  };
}

module.exports = {
  config,
};
