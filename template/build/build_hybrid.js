// https://github.com/shelljs/shelljs
require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var path = require('path')
var chalk = require('chalk')
var shell = require('shelljs')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

function HtmlAddScript (options) {
  this.options = options
}

HtmlAddScript.prototype.apply = function(compiler) {
  var paths = this.options.paths
  compiler.plugin('compilation', function(compilation, options) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
      for (var i = paths.length - 1; i >= 0; i--) {
        htmlPluginData.assets.js.unshift(paths[i])
      }
      callback(null, htmlPluginData)
    })
  })
}

config.build.assetsPublicPath = ''
webpackConfig.plugins.push(new HtmlAddScript({
  paths: ['cordova.js']
}))

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
shell.rm('-rf', assetsPath)
shell.mkdir('-p', assetsPath)
shell.config.silent = true
shell.cp('-R', 'static/*', assetsPath)
shell.config.silent = false

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
})
