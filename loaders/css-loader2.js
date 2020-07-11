const { stringifyRequest } = require('loader-utils')
const postcss = require('postcss')
const tokenizer = require('css-selector-tokenizer')

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

function loader(source,inputSourceMap,data){

  return source
}

module.exports = loader

loader.pitch=function(){

}
