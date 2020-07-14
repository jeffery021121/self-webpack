/**
 * ast初体验，修改函数名称。
 * 学习ast方法：通过ast解析网站(https://astexplorer.net/)可以查看对应数据的ast
 * 查看所有的类型  https://babeljs.io/docs/en/next/babel-types.html
 * 下面三者其实babel自己实现了自己的一套
 * esprima 解析字符串成语法树
 * estraverse 遍历语法书并提供钩子访问器
 * escodegen 将语法书生成代码
 */
const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')

let code = 'function ast(){}';
let ast = esprima.parseScript(code)

estraverse.traverse(ast, {
  enter(node) {
    if (node.type === 'FunctionDeclaration') {
      console.log(node)
      node.id.name = 'newCode'
    }
  }
})

let newCode = escodegen.generate(ast)
console.log(newCode)