
function loader(source,sourceMap){
  console.log('loader-a',this.data);
  // console.log('loader-a sourceMap',sourceMap);
  return source+"//loder-a";
}

loader.pitch = function(reminingRequest,previousRequest,data){
  data.name = "loder-a-pitch";
  console.log('loder-a-pitch');
  //return "loader-a-content;";
}
module.exports = loader;
/**
 * loader的返回值有两种
 * 1.一种是就是返回一个JS模块化的代码  module.exports = "xx"; 可以作为最左边的loader
 * 2. 其它的就是可以返回任意内容 css样式语句 图片的二进制buffer 不可能作为最左边的loader
 * webpack要求,不管哪个模块,最终都要返回一个JS代码块
 * webpack本身就是一个把任意模块转成JS模块的工作
 */