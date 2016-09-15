
const {resolve} = require('path')
const webpackValidator = require('webpack-validator')
const OfflinePlugin = require('offline-plugin');

module.exports = webpackValidator({
          debug: true,
        context: resolve('./scripts'),  
         entry: './main.js',
          output: { 
            path: resolve('dist'),
            publicPath: '/dist/',
            filename: 'bundle.js',
            pathinfo :true,
          },
          ///Change eval to source-map for production
          devtool: 'eval',
          module: {
            loaders :[
                {test:/\.(jsx|js)$/,exclude: /node_modules/,loader: 'imports?jQuery=jquery,$=jquery,this=>window'},
                { test: /\.css$/,exclude: /node_modules/, loader: "style-loader!css-loader" },
                // ASSET LOADER
                {test: /\.(woff|woff2|ttf|eot)$/,loader: 'file'},
                 //IMAGE LOADER
                { test: /\.(jpe?g|png|gif|svg)$/i,loader:'file',exclude: /node_modules/},
                {test: /\.html$/,loader: "html-loader",exclude: /node_modules/}
                ]

  
  

              },
          resolve: {
                  extensions: ['', '.js', '.jsx','.css','.jpg']
                },
        
            plugins: [
            //new OfflinePlugin()
            ]
});
/*{
              caches:{'main':['./app/images/bgz.jpg','./app/images/hamburger.svg','./app/images/logo_grey.svg'],'additional':['./app/images/bgz.jpg','./app/images/hamburger.svg','./app/images/logo_grey.svg']},
              'externals':['./app/images/bgz.jpg','./app/images/hamburger.svg','./app/images/logo_grey.svg'],
              ServiceWorker:{output:'./sw.js'},safeToUseOptionalCaches:true}
              */