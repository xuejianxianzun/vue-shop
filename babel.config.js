const propPlugins = []
// 只在生产环境里启用的插件
if (process.env.NODE_ENV === 'prodution') {
  propPlugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/app', ['@babel/preset-env', { modules: false }]],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...propPlugins
  ]
}
