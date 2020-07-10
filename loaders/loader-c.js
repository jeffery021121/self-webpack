
function loader(source){
  console.log('loader-c',this.data);
  return source+"//loder-c";
}

loader.pitch = function(reminingRequest,previousRequest,data){
  data.name = "loder-c-pitch";
  console.log('loder-c-pitch');
}
module.exports = loader;