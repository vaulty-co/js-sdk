function isSafari() {
  const {
    userAgent = '',
    vendor = '',
  } = navigator;
  return vendor.indexOf('Apple') > -1
    && userAgent.indexOf('CriOS') === -1
    && userAgent.indexOf('FxiOS') === -1;
}

export default isSafari;
export {
  isSafari,
};
