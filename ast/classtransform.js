const babel = require('@babel/core')
// const transformClassesPlugin = require('babel-plugin-transform-es2015-classes');

const code = `
class Person {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
`

/*
// 因为
    function Person(name) {
        this.name = name;
    }
    Person.prototype.getName = function () {
        return this.name;
    }
*/
function clssTransform(babel) {
    const t = babel.types
    return {
        visitor: {
            ClassDeclaration(path) {
                const { id } = path.node
                const methods = path.node.body.body
                let baseStament
                let methodStaments = []
                methods.forEach(method => {
                    if (method.kind === 'constructor') {
                        baseStament = t.FunctionDeclaration(id, method.params, method.body, false, false)
                    } else {
                        const operator = '='
                        const left=t.memberExpression(t.memberExpression(id,t.identifier('prototype')), method.key)
                        const right = t.FunctionExpression(method.key, method.params, method.body) 
                        const AssignmentExpression = t.assignmentExpression(operator, left, right)
                        const expression = AssignmentExpression
                        const result = t.expressionStatement(expression)
                        methodStaments.push(result)
                    }
                })
                path.replaceWithMultiple([baseStament,...methodStaments])
            }
        }
    }
}




const result = babel.transform(code, {
    plugins: [clssTransform]
})

console.log('result.code', result.code)