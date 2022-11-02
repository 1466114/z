const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    proxy: {
        '/api': {
          target: 'https://api.qweather.com/v7/weather/', //API服务器的地址
          ws: true, //代理websockets
          changeOrigin: true, // 是否跨域，虚拟的站点需要更管origin
          pathRewrite: {
            '^/api': '',
          }
        }
    },
}  
})
