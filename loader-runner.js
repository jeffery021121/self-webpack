/* 
loader-runner
就是执行loader的，之前的callback async() 等等问题都将在这里解决
每一个文件的处理都有一个LoaderRunner

思路：
一个工具方法 createLoaderObject 把loader分成 pitch,request，normal 和data四部分
暴露一个方法 runLoaders(有专门的这个库 https://github.com/webpack/loader-runner/blob/v2.4.0/lib/LoaderRunner.js)
  处理顺序 pitchs 源码 loaderNormals
  loaderNormal 执行的时候需要把loaderContext作为this绑定上去
  loaderContext上
              有async方法返回callback 
              有callback方法，手动继续loader数组的执行
              有loaderIndex计数当前是第几个loader
              有loaders 存储所有处理好的loader
              有resource，就是要处理的源文件。
              有remainingRequest,currentRequest,previousRequest和data(后置的request上要有源文件，每个模块用!连接)
              data就是当前loader的data
  三个方法，
          iteratePitchingLoaders,遍历pitch
          iterateNormalLoaders，遍历normal（注意normal.raw的情况）
          processResource 处理源文件
runLoaders 接收options和一个回调（err first原则）
options 上是loaders和resource
buffer和字符串相互转换的方法   Buffer.from(source)  source.toString('utf8')
*/
// 应用，参数在真的环境中是weback给传递的

const path = require('path');
const loader = require('./loaders/loader-a');
let entry = "./src/index.js";
let options = {
  resource: path.join(__dirname, entry),//要加载的模块
  loaders: [
    path.join(__dirname, 'loaders/loader-a.js'),
    path.join(__dirname, 'loaders/loader-b.js'),
    path.join(__dirname, 'loaders/loader-c.js')
  ]
}
runLoaders(options, (err, result) => {
  console.log('result', result);
});


// 一个工具方法 createLoaderObject 把loader分成 pitch, request，normal 和data四部分
function createLoaderObject(request) {
  const loaderObject = { data: {} }
  loaderObject.request = request
  loaderObject.normal = require(request)
  loaderObject.pitch = loaderObject.normal.pitch || (() => { })
  return loaderObject
}

function runLoaders(options, callback) {
  // 先处理loader，整理参数
  const loaders = options.loaders.map(createLoaderObject)

  const loaderContext = {
    loaders,
    resource: options.resource, // 这个只是路径
    loaderIndex: 0,
    sync: true,
    async,
    callback: innerCallback
  }

  function async() {
    loaderContext.sync = false
    return innerCallback
  }

  function innerCallback(err, source) {
    loaderContext.sync = true
    iterateNormalLoaders(source)
  }

  Object.defineProperty(loaderContext, 'request', {
    get: function () {
      const { loaderIndex, loaders, resource } = loaderContext
      const request = loaders.map(item => item.request).concat(resource).join('!')
      return request
    }
  })

  Object.defineProperty(loaderContext, 'remainingRequest', {
    get: function () {
      const { loaderIndex, loaders, resource } = loaderContext
      const arr = []
      loaders.forEach((item, index) => { index > loaderIndex && arr.push(item.request) })
      return arr.join('!') + `!${resource}`
    }
  })

  Object.defineProperty(loaderContext, 'currentRequest', {
    get: function () {
      const { loaderIndex, loaders, resource } = loaderContext
      const arr = []
      loaders.forEach((item, index) => { index >= loaderIndex && arr.push(item.request) })
      return arr.join('!') + `!${resource}`
    }
  })

  Object.defineProperty(loaderContext, 'previousRequest', {
    get: function () {
      const { loaderIndex, loaders } = loaderContext
      const arr = []
      const request = loaders.forEach((item, index) => { index < loaderIndex && arr.push(item.request) })
      return arr.join('!')
    }
  })

  Object.defineProperty(loaderContext, 'data', {
    get: function () {
      const { loaderIndex, loaders } = loaderContext
      return loaders[loaderIndex].data
    }
  })

  function iteratePitchingLoaders() {
    let { loaders, loaderIndex, remainingRequest, previousRequest } = loaderContext
    if (loaderIndex >= loaders.length) {
      loaderContext.loaderIndex--
      return processResource()
    }
    const { pitch, data } = loaders[loaderIndex]
    const pitchResult = pitch(remainingRequest, previousRequest, data)
    if (pitchResult) {
      loaderContext.loaderIndex--
      return iterateNormalLoaders()
    }

    loaderContext.loaderIndex++
    iteratePitchingLoaders()
  }

  function processResource() {
    // 处理源文件
    const { resource } = loaderContext
    const fs = require('fs')
    const buffer = fs.readFileSync(resource)
    iterateNormalLoaders(buffer)
  }

  function iterateNormalLoaders(source) {
    const { loaders, loaderIndex, sync } = loaderContext
    if (loaderIndex < 0) return callback(null, source)
    const { normal, data } = loaders[loaderIndex]
    if (normal.raw && !Buffer.isBuffer(source)) source = Buffer.from(source)
    if (!normal.raw && Buffer.isBuffer(source)) source = source.toString('utf8')
    const nSource = normal.call(loaderContext, source, 'inputSourceMap', data)
    if (sync) {
      loaderContext.loaderIndex--
      iterateNormalLoaders(nSource)
    }
  }
  
  iteratePitchingLoaders()
}
