const path = require("path"); //处理路径的
//自动生成HTML文件的
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development", //development不压缩代码 production 会进行压缩
  // devtool: "none", //不需开发的source-map文件
  // devtool: "cheap-source-map",
  // devtool: "nosources-source-map",
  devtool: 'hidden-source-map',

  entry: {
    index: "./src/index.js"
  }, //入口模 块
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  //在webpack解析loader的时候会走这个配置
  resolveLoader: {
    // alias: {//别名,和下面功能重合了
    //   'babel-loader':path.resolve(__dirname,'loaders','babel-loader.js')
    // },
    //指定去哪些目录 下面找loader,默认只找node_modules
    modules: [path.resolve(__dirname, 'loaders'), path.resolve(__dirname, 'node_modules')]
  },
  //配置如何查找普通模块
  resolve: {
    alias: {},
    modules: []
  },
  module: {
    rules: [
      {
        test: /.js$/,
        // use: ['babel-loader']
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test:/.jpeg$/,
        use:['file-loader2']
      },
      {
        test: /\.png$/,//设置要转换的模块名的正则
        //如果你要加载的模块ID是以.js结尾的,我就会把此模块先从硬盘上读出来,传递给babel-loader
        use: [
          {
            loader: 'url-loader2',
            options: {
              filename: '[hash].[ext]',
              limit: 64 * 1024
              //如果文件的字节数小于64的话,就不拷贝文件了,直接base64
            }
          }
        ]
      },
      {
        test: /\.less$/,//设置要转换的模块名的正则
        //如果你要加载的模块ID是以.js结尾的,我就会把此模块先从硬盘上读出来,传递给babel-loader
        use: ['style-loader2','less-loader2']
      },
      {
        test: /\.css$/,//设置要转换的模块名的正则
        //如果你要加载的模块ID是以.js结尾的,我就会把此模块先从硬盘上读出来,传递给babel-loader
        use: ['style-loader2', 'css-loader2']
      },
    ]
  },
  plugins: [//每一个插件都会有一个apply方法
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};

/**
 * 如果我希望加载一个自定义loader,如何加载呢?
 * 1.设置成绝对路径
 * 2.配置resolveLoader
 */