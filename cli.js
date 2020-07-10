const webpack = require('webpack')
const options = require('./webpack.config')
const compiler = webpack(options)
compiler.run((err,stats)=>{
  console.log(err, 11111)
  console.log(stats.toJson(), 11111) //编译信息
})