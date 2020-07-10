
const babel = require('@babel/core')
function loader(source, inputSourceMap) {
  // console.log('inputSourceMap 1::==================================================================', inputSourceMap)
  const options = {
    presets: ['@babel/preset-env'],
    inputSourceMap,
    sourceMap: true,
    // filename:'aaaaaa.js'
  }
  let { code, map, ast } = babel.transform(source, options)
  // console.log('code-------', code)
  // console.log('map-------', map)
  // console.log('ast------', ast)
  return this.callback(null, code, map, ast);
}


module.exports = loader