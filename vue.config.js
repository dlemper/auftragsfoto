const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "src/assets", to: "assets" },
          { from: "client/dist", to: "client/dist" }
        ],
      }),
    ],
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['formidable'],
      chainWebpackMainProcess: (config) => {
        // Chain webpack config for electron main process only
        config.externals({
          formidable: 'commonjs formidable',
        });
      },
    },
  },
};
