const { getOptions } = require('loader-utils')
const less = require('less')

/* 
less.render(lessInput, options)
    .then(function(output) {
        // output.css = string of css
        // output.map = string of sourcemap
        // output.imports = array of string filenames of the imports referenced
    },
    function(error) {
    });

// or...

less.render(css, options, function(error, output) {})
*/

function loader(source,inputSourceMap) {
  const callback = this.async()
  less.render(source, { filename: this.source }).then(output => {
    // console.log('less生成的代码', output)
    /* err: Error | null,
    content: string | Buffer,
    sourceMap ?: SourceMap,
    meta ?: any */
    const nextSource = `module.exports = ${JSON.stringify(output.css)}`
    // callback(null, output.css, output.map)
    callback(null, nextSource, output.map)
  }).catch(err => {
    console.log('less处理报错啦', err)
  })
}

module.exports = loader