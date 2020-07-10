
const babel = require('@babel/core')
function loader(source, inputSourceMap) {
  // console.log('inputSourceMap 2::==================================================================', inputSourceMap)
  const options = {
    presets: ['@babel/preset-env'],
    inputSourceMap,
    sourceMap: true,
  }
  let { code, map, ast } = babel.transform(source, options)
  return this.callback(null, code, map, ast);
}


module.exports = loader