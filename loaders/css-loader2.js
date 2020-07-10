let { stringifyRequest } = require('loader-utils');
let postcss = require('postcss');
var Tokenizer = require('css-selector-tokenizer');
/**
 * @import 引入别的CSS文件
 */
function loader(source) {
  let plugin = (options) => {
    return (cssRoot) => {//cssRoot的根
      cssRoot.walkAtRules(/^import$/, (rule) => {
        console.log(JSON.stringify(rule, null, 2));

        rule.remove();//把这个规则干掉
        //把引入的CSS文件放扩imports数组中
        options.imports.push(rule.params.slice(1, -1));//./global.css
      });
      cssRoot.walkDecls(decl => {
        let values = Tokenizer.parseValues(decl.value);
        //console.log(JSON.stringify(values,null,2));
        values.nodes.forEach(value => {
          value.nodes.forEach(item => {
            if (item.type === 'url') {
              item.url = "`+require(" + stringifyRequest(this, item.url) + ")+`";
            }
          });
        });
        decl.value = Tokenizer.stringifyValues(values);
        console.log('decl', decl);
      });
    }
  }
  let callback = this.async();
  let options = { imports: [] };
  //安排流水线,让插件一个一个执行,处理css文本
  let pipeline = postcss(plugin(options));
  //开始执行流水线
  pipeline.process(source).then(function (result) {
    //console.log(options.imports);
    //console.log(result.css);
    //options.imports=['./global.css']
    let importCSS = options.imports.map(url => "`+require(" + stringifyRequest(this, "!!css-loader2!" + url) + ")+`").join("\r\n");
    console.log('importCSS', importCSS);
    callback(null, "module.exports= `" + importCSS + "\r\n" + result.css + "`");
  });
}
module.exports = loader;

/**
{
  "type": "values",
  "nodes": [
    {
      "type": "value",
      "nodes": [
        {
          "type": "item",
          "name": "100px"
        }
      ]
    }
  ]
}
{
  "type": "values",
  "nodes": [
    {
      "type": "value",
      "nodes": [
        {
          "type": "item",
          "name": "100px"
        }
      ]
    }
  ]
}
{
  "type": "values",
  "nodes": [
    {
      "type": "value",
      "nodes": [
        {
          "type": "url",
          "stringType": "'",
          "url": "./logo.png"
        }
      ]
    }
  ]
}
{
  "type": "values",
  "nodes": [
    {
      "type": "value",
      "nodes": [
        {
          "type": "item",
          "name": "cover"
        }
      ]
    }
  ]
}
{
  "type": "values",
  "nodes": [
    {
      "type": "value",
      "nodes": [
        {
          "type": "item",
          "name": "red"
        }
      ]
    }
  ]
}
 */