const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new DefinePlugin({
        'process.env': {
          DASHBOARD_BACKEND_URL: JSON.stringify(process.env.DASHBOARD_BACKEND_URL)
        }
      })
    ]
  }
};
