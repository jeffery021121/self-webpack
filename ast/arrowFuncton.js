/**
 *  转换箭头函数 babel-plugin-transform-es2015-arrow-functions
 *  先在父页面放入 var _this = this
 *  然后再本页面找到 thisexpreesion 替换成上面定义的 _this
*/

const babel = require('@babel/core')
const t = require('@babel/types')
const arrowPlugin = require('babel-plugin-transform-es2015-arrow-functions')
const code = `
const sum = (a,b)=>{
    console.log(this);
    return a+b;
}`

function selfPlugin(bable) {
  const t = babel.types
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        const id = path.parentPath.scope.generateUidIdentifier('this')
        path.parentPath.scope.push({ id, init: t.thisExpression() })
        path.node.type = 'FunctionExpression'
        const thisPaths = []
        path.traverse({
          ThisExpression(child) {
            child.replaceWith(t.identifier(id.name))
          }
        })
      }
    }
  }
}

const result = babel.transform(code, { plugins: [selfPlugin] })

console.log(result.code)
