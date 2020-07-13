const { stringifyRequest } = require('loader-utils')
const postcss = require('postcss')
const Tokenizer = require('css-selector-tokenizer')

/**
 * 前置知识就是了解 postcss 和 css-selector-tokenizer这两个库怎么使用
 * postcss api http://api.postcss.org/postcss.html#.plugin
 * https://dockyard.com/blog/2018/02/01/writing-your-first-postcss-plugin 这篇文章叫你怎么写postcss插件以及一些变量的含义
 * css-selector-tokenizer
*/

// const selfTestPostcssplugin = 
const postcssTestPlugin = postcss.plugin('postcss-test-plugin', function () {
  return function (root) {
    root.walkRules(function (rule) {
      rule.walkDecls(/^overflow-?/, function (decl) {
        if (decl.value === 'scroll') {
          var hasTouch = rule.some(function (i) {
            return i.prop === '-webkit-overflow-scrolling';
          });
          if (!hasTouch) {
            rule.append({
              prop: '-webkit-overflow-scrolling',
              value: 'touch'
            });
          }
        }
      });
    });
  };
});

const cssRequirePlugin = postcss.plugin('css-require-plugin', function (options) {
  return function (root) {
    root.walkAtRules(/^import$/, function (rule) {
      rule.remove()
      options.imports.push(rule.params)
    })
    root.walkDecls(function (decl) {
      let values = Tokenizer.parseValues(decl.value)
      values.nodes.forEach(value => {
        value.nodes.forEach(item => {
          if (item.type === 'url') {
            console.log('item::::::::::', item)
            // item.url = "require(item.url)"; //这个代码后期执行会有eval，item.url要在这里解析 "require("+item.url+")"
            // "require("+stringifyRequest(options.context, item.url)+")"
            // 对应上外部的模板字符串 "`+require("+stringifyRequest(options.context, item.url)+")+`"
            // 这里感觉还是不理解。
            item.url = "`+require(" + stringifyRequest(options.context, item.url) + ")+`";
          }
        })
      })
      decl.value = Tokenizer.stringifyValues(values)
    })
  }
})

function loader(source, inputSourceMap, data) {
  const callback = this.async()
  const options = { imports: [], context:this }
  postcss([cssRequirePlugin(options)]).process(source).then(res => {
    console.log('res', res.css)
    let imports = options.imports.map(item=>`require(${item})`).join('')
    callback(null, imports + "\r\n" +"module.exports=`" + "\r\n" +res.css+"`")
  })

}

module.exports = loader

loader.pitch = function () {

}
