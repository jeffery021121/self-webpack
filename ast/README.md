# ast学习

> 抽象语法树，我觉得最大的问题还是熟悉和使用api.

官网 <https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md>

- 学习ast方法：通过ast解析网站(<https://astexplorer.net/)可以查看对应数据的ast>
- 查看所有的类型  <https://babeljs.io/docs/en/next/babel-types.html>
- ast 的步骤是比较固定的 解析字符串成ast(esprima,acorn,@babel/parse等)，遍历树（使用访问器可以访问对应节点 esTraverse） ,生成新的代码字符串（escodegen）
