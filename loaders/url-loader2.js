let { getOptions } = require('loader-utils')
let mime = require('mime')
// 判断大小，如果不超标直接转成base64

function loader(source) {
  const options = getOptions(this)
  let { limit = 64 * 1024, fallback = "./file-loader2", filename = '[hash].[ext]' } = options
  // console.log('limit::::', limit)
  // console.log('urlLoader2;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;', this.resource, this.resourcePath)

  if (limit) limit = parseFloat(limit)
  const mimeType = mime.getType(this.resourcePath)
  if(limit && limit>source.length){
    const base64Str = `data:${mimeType};base64,${source.toString("base64")}`
    return `module.exports = ${JSON.stringify(base64Str)}`
  }
  let fallbackLoader = require(fallback)
  return fallbackLoader.call(this, source) // 不绑定this的话， 它的this就是global，其实应该是 loaderContext 即当前this
  // return fallbackLoader(source)
}

loader.raw = true;
module.exports = loader