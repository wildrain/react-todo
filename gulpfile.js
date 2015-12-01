var gulp                  = require('gulp');
var less                  = require('gulp-less');
var notify                = require('gulp-notify');
var plumber               = require('gulp-plumber');
var livreload             = require('gulp-livereload');
var gutil 		            = require("gulp-util");
var webpack 	            = require("webpack");
var path                  = require("path");
var WebpackNotifierPlugin = require('webpack-notifier');


var config = {
  color: true,
  progress: true,
  watch: true,
  devtool: 'eval',
  debug: true,
  entry: {
    'backend.js':'./assets/src/backend/backend.js',
    'frontend.js' : './assets/src/frontend/frontend.js'
  },
  output: {
    path: './assets/dist/js/',
    filename: '[name]'
  },
  resolve: {
   extensions: ['', '.js', '.json', '.coffee']
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel'},
    ],
  },
  plugins: [
      new WebpackNotifierPlugin({ title: 'Webpack' ,  sound: 'Glass' }),
   ],

};

//gulp webpack task for normal mode
gulp.task('webpack', function() {
  webpack(config, function(err, stats) {
     if(err) throw new gutil.PluginError("webpack", err);
     gutil.log("[webpack]", stats.toString({
     }));
  });
});


gulp.task('js-minify', function() {
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new WebpackNotifierPlugin({title: 'Webpack'}),
	];
  config.watch = false;
  webpack(config, function(err, stats) {
     if(err) throw new gutil.PluginError("webpack", err);
     gutil.log("[webpack]", stats.toString({
     }));
  });
});




// Error handler for less
function errorAlert(error){
  notify.onError({title: "Gulp Compiled Error", message: "Check your terminal", sound: "Sosumi"})(error);
  console.log(error.toString());
  this.emit("end");
};



// gulp less task
gulp.task('less', function() {
	return gulp.src('./assets/src/less/style.less')
	.pipe(plumber({errorHandler: errorAlert}))
	.pipe(less())
	.pipe(notify({
    title: 'Gulp',
    subtitle: 'success',
    message: 'less task',
    sound: "Pop"
  }))
  .pipe(gulp.dest('./assets/dist/css/'));
});





// watch task
gulp.task('watch', function() {
	gulp.watch('./assets/src/less/*.less', ['less']);
});




// webpack production task
// TODO : Try to add less-minify task , that will minify the css , 
// TODO : Also try to compress images 
gulp.task('production',['js-minify']);



// default task
gulp.task('default', ['watch', 'less', 'webpack']);
