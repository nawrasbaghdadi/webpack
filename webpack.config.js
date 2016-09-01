
module.exports = {
  entry: ["./app/scripts/main.js","./app/scripts/skrollr.js"],
  output: {
    filename: "./app/scripts/bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']

  },
   module: {
		  loaders :[
		  {test:/\.(jsx|js)$/,exclude: /node_modules/,loader: 'imports?jQuery=jquery,$=jquery,this=>window' },
		  {test:/skrollr.js/,exclude: /node_modules/,loader: 'exports?skrollr'}

		  ]
		  }
};
