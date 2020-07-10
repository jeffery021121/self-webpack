const { stringifyRequest } = require('loader-utils')

function loader(source,inputSourceMap,data) {

//   let codeStr = `
//   const style = document.createElement('style')
//   style.innerHTML=${JSON.stringify(source)}
//   document.head.appendChild(style)
// `
// return codeStr
}

// stringifyRequest可以把绝对路径转成相对路径  !!./src/...less-loader!./src/main.less 链接https://github.com/webpack/loader-utils#stringifyrequest
loader.pitch=function(remainingRequest,previousRequest,data){
  const scriptStr=`
  const style = document.createElement('style')
  style.innerHTML=require(${stringifyRequest(this, "!!" +remainingRequest)})
  document.head.appendChild(style)
  `
return scriptStr
}
module.exports = loader