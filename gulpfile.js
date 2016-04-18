'use strict'

var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    // rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin');

var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var config = require('./build/webpack.prod.config.js');//prod

var paths = {
    watchfiles: ['src/**/*.vue', 'src/**/*.js', 'src/*.vue'],
    scripts: 'src/assets/js/*',
    styles: ['src/assets/style/*','src/assets/fonts/*'],
    images: 'src/assets/image/*'
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
gulp.task('style', function() {
    gulp.src(paths.styles[0])
        .pipe(minifycss())
        .pipe(gulp.dest('dist/style'));
    gulp.src(paths.styles[1])
        .pipe(gulp.dest('dist/fonts'));
});
/**
 * images
 */
gulp.task('images', function() {
     gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});
/** 
 *  压缩js文件
 */
gulp.task('scripts', function() {
    gulp.src(paths.scripts)
        // .pipe(rename({suffix:'.min'}))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
/**
 * 监听文件修改后使用webpack打包
 */
gulp.task('watch', function() {
    gulp.watch(paths.watchfiles, ['webpack']);
    // gulp.watch(paths.images, ['images']);
});
gulp.task('default', ['style','scripts','images', 'webpack', 'watch'], function() {
    gulp.start('start');
});
