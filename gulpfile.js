'use strict'

var gulp = require('gulp'),
    // minifycss = require('gulp-minify-css'),
    // uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    // rename = require('gulp-rename'),
    del = require('del');
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var config = require('./build/webpack.prod.config.js');

var paths = {
    scripts: ['src/**/*.vue', 'src/**/*.js', 'src/*.vue'],
    images: 'src/assets/**/*'
};
/** 
 *  清理生产目录文件
 */
/*gulp.task('clean', function(cb) {
    del(['./dist/*.js', './dist/*.css', './dist/*.map']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});*/
/**
 * 服务自动启动
 */
gulp.task('start', function() {
    nodemon({
        script: 'app.js',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' }
    });
});

/** 
 *  执行webpack打包
 */
/*gulp.task('webpack', ['clean'], function(cb) {
    webpack(config, cb)
});*/
gulp.task('webpack', function(cb) {
    webpack(config, cb)
});
/** 
 *  压缩css文件
 */
/*gulp.task('style',function() {
    gulp.src('./dist/style.css')
    .pipe(rename({suffix:'.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist'));
});*/

/** 
 *  压缩js文件
 */
gulp.task('scripts', function() {
    gulp.src('./dist/*.js')
        // .pipe(rename({suffix:'.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
/**
 * 监听文件修改后使用webpack打包
 */
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['webpack']);
    // gulp.watch(paths.images, ['images']);
});
gulp.task('default', ['webpack', 'watch'], function() {
    gulp.start('start');
});
