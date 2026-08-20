'use strict';

const path = require('path');

// Heft emits to lib/ with import specifiers untouched, so the tsconfig "@/*"
// alias has to be repeated for webpack or every aliased import fails to resolve.
// Also disables HMR: without an HMR handler the dev server full-page-reloads on
// every rebuild, which throws away SharePoint page state.
module.exports = function customizeWebpack(config) {
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    '@': path.resolve(__dirname, '..', 'lib')
  };

  if (!config.devServer) return;

  config.devServer.hot = false;
  config.devServer.liveReload = false;
  if (config.devServer.client) config.devServer.client.reconnect = false;

  config.plugins = (config.plugins || []).filter(
    (plugin) => plugin && plugin.constructor && plugin.constructor.name !== 'HotModuleReplacementPlugin'
  );
};
