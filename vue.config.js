const path = require('path')
const defaultSettings = require('./src/settings.js')

const name = defaultSettings.title || '最多报一次' // page title

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  runtimeCompiler: true,
  publicPath: './', // router hash 模式使用
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    open: true,
    proxy: {
      '/dev-api': {
        target: 'http://60.191.64.3:8601/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/dev-api': ''
        }
      }
    }
  },
  configureWebpack: {
    name: name, // index.html中title设置
    resolve: {
      alias: {
        '@': resolve('src') // 默认设置可以根据需要添加
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#d94141'
        },
        // 项目允许加载less文件
        javascriptEnabled: true
      }
    }
  },

  chainWebpack: config => {
    // svg rule loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    /**
     * 下面都是优化性能
     */
    // runtime单独处理
    config.optimization.runtimeChunk('single')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 首屏加载速度提升
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    /**
     * chunk包分割
     * 这个部分更多是骗自己吧
     * 毕竟代码分割后还是需要加载，但是有并行加载
     * 拆分的比较细将每个npm -S都进行了拆分，主要是为了浏览器Coverage分析其实并没有必要
     */
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        common: {
          name: 'chunk-common', // 打包后的文件名
          chunks: 'initial', //
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          reuseExistingChunk: true
        },
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          // maxSize: 1024,
          priority: 2,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        components: {
          name: 'chunk-components', // 对views/components中的文件单独进行打包
          test: resolve('src/components'),
          minChunks: 3,
          priority: 3,
          reuseExistingChunk: true
        },
        views: {
          name: 'chunk-views', // 对views/views中的文件单独进行打包
          test: resolve('src/views'),
          minChunks: 3,
          priority: 4,
          reuseExistingChunk: true
        },
        moment: {
          name: 'chunk-moment',
          test: /[\\/]node_modules[\\/]_?moment(.*)/,
          chunks: 'initial',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        },
        axios: {
          name: 'chunk-axios',
          test: /[\\/]node_modules[\\/]_?axios(.*)/,
          chunks: 'initial',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        },
        router: {
          name: 'chunk-router',
          test: /[\\/]node_modules[\\/]_?vue-router(.*)/,
          chunks: 'initial',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        },
        vue: {
          name: 'chunk-vue',
          test: /[\\/]node_modules[\\/]_?vue(.*)/,
          chunks: 'initial',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        },
        core: {
          name: 'chunk-core',
          test: /[\\/]node_modules[\\/]_?core(.*)/,
          chunks: 'initial',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        },
        store: {
          name: 'chunk-store',
          test: /[\\/]node_modules[\\/]_?vuex(.*)/,
          chunks: 'initial',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        },
        nprogress: {
          name: 'chunk-nprogress',
          test: /[\\/]node_modules[\\/]_?nprogress(.*)/,
          chunks: 'initial',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        },
        icons: {
          name: 'chunk-icons',
          test: /[\\/]node_modules[\\/]_?ant-design_icons(.*)/,
          chunks: 'initial',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        },
        antDesignVue: {
          name: 'chunk-ant-design-vue',
          test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/,
          chunks: 'initial',
          priority: 5,
          // maxSize: 1024,
          reuseExistingChunk: true,
          enforce: true
          // maxSize: 1024,
        }
      }
    })

    // 打包分析
    // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // 分析包内容
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
      }
    }
  }
}
