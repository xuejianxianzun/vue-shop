module.exports = {
  productionSourceMap: false,

  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 设置入口文件
      config.entry('app').clear().add('./src/main-prod.ts')

      // 使用 externals 抽离依赖项，设置在这里的依赖项不会被打包，所以我们可以用 cdn 引入这些依赖
      // 左侧是这些依赖的包名，右侧是这些依赖在使用中的名字
      config.set(['externals', {
        vue: 'Vue',
        nprogress: 'NProgress'
      }])

      // 设置 htmlWebpackPlugin 插件上的标识
      config.plugin('html').tap(args => {
        args[0].isProd = true
        args[0].title = '电商管理后台'
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      // 设置入口文件
      config.entry('app').clear().add('./src/main-dev.ts')

      // 设置 htmlWebpackPlugin 插件上的标识
      config.plugin('html').tap(args => {
        args[0].isProd = false
        args[0].title = '电商管理后台'
        return args
      })
    })
  }
}
