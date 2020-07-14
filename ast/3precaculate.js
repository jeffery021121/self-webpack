const babel = require('@babel/core')
const code = `let delay = (2+3)*4+6/2`;//20

function preCaculate(babel) {
    const t = babel.types
    return {
        visitor: {
            BinaryExpression(path) {
                const { left, right, operator } = path.node
                if (left.type === 'NumericLiteral' && right.type === 'NumericLiteral' && operator) {
                    let result = eval(left.value + operator + right.value)
                    path.replaceWith(t.numericLiteral(result))
                    if (path.parent && path.parent.type === 'BinaryExpression') preCaculate(babel).visitor.BinaryExpression(path.parentPath)
                }
            }
        }
    }
}


const result = babel.transform(code, {
    plugins: [preCaculate]
})

console.log('result:',result.code)