module.exports = {
  productionSourceMap: false,

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.externals = {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        echarts: 'echarts'
      }
    }
  }
}
