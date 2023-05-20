const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      },
      '/beauty': {
        target: 'http://www.aichest.cn/juzi/api.php',
        pathRewrite: {
          '^/beauty': ''
        },
        changeOrigin: true
      }
    }
  }
});
