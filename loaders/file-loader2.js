const { getOptions, interpolateName } = require('loader-utils')
/* 
通过 loaderUtils.interpolateName 方法可以根据 options.name 以及文件内容生成一个唯一的文件名 url（一般配置都会带上 hash，否则很可能由于文件重名而冲突）
通过 this.emitFile(url, content) 告诉 webpack 我需要创建一个文件，webpack 会根据参数创建对应的文件，放在 public path 目录下
返回 module.exports = ${JSON.stringify(url)},这样就会把原来的文件路径替换为编译后的路径
*/
function loader(source, inputSourceMap, data) {
  let options = getOptions(this) || {}
  // console.log('fileLoader2;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;', this.resource)
  const url = interpolateName(this, options.filename || '[hash].[ext]', { content: source })
  this.emitFile(url, source)
  return `module.exports = ${JSON.stringify(url)}`
}
loader.raw = true // 不需要webpack再处理export的代码。
module.exports = loader