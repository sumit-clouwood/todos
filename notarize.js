require('dotenv').config();
const { notarize } = require('electron-notarize');
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }
  const appName = context.packager.appInfo.productFilename;
  //const appleId = "joe@doodlebuddy.co";
  //const password = `@keychain:"Application Loader: ${appleId}"`;
  // Using safe keychain access as detailed here: https://github.com/electron/electron-notarize
  return await notarize({
    appBundleId: 'com.electron-todo-demo.io',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: 'geek4teck@gmail.com', //appleId, /*"joe@doodlebuddy.co:", /*process.env.APPLEID, */
    appleIdPassword: 'lddh-pimv-xxsp-toov', //password, /*"eomq-pviv-rthz-gjub", process.env.APPLEIDPASS, */
    ascProvider: '294ZLV45MZ',
  });
};
