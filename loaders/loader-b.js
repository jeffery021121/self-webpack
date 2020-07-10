
function loader(source){
  console.log('loader-b',this.data);
  let callback = this.async();
  setTimeout(()=>{
    callback(null,source+"//loder-b",'sourceMap');
  },3000);
  //this.callback();
  //console.log('loader-b',this.data);
  //return source+"//loder-b";
}

/**
 * 假如说pitch方法有返回值,那么就相当于自己这个loader和它之后的loader都已经执行完毕了
 * @param {*} reminingRequest 剩下的请求 c和文件
 *  C:\anormal\zhufengwebpack2020\2.webpack_loader\loaders\loader-c.js!C:\anormal\zhufengwebpack2020\2.webpack_loader\src\main.js
 * @param {*} previousRequest 之前的请求  C:\anormal\zhufengwebpack2020\2.webpack_loader\loaders\loader-a.js
 * @param {*} data 
 * request 完整的请求
 * request loader-a.js!loader-b.js!loader-c.js!./src/main.js
 */
loader.pitch = function(reminingRequest,previousRequest,data){
  console.log('reminingRequest',reminingRequest);
  console.log('previousRequest',previousRequest);

  data.name = "loder-b-pitch";
  console.log('loder-b-pitch');
  ///return "loader-b-pitch";
}
module.exports = loader;