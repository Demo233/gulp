/*
* @Author: Administrator
* @Date:   2017-03-28 15:18:55
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-10 16:50:31
*/

'use strict';
var gulp = require("gulp");
var babel = require('gulp-babel');
var rev = require('gulp-revm');
var revContent = require('gulp-rev'); //更改版本名  
var revCollector = require('gulp-revm-collector');  //gulp-rev的插件，用于html文件更改引用路径 
var clean = require('gulp-clean'); //清空文件夹 
var notify = require('gulp-notify')

var uglify = require("gulp-uglify");
var pump = require('pump');
var stripDebug = require('gulp-strip-debug');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');  
var replace = require('gulp-replace');

// var browserSync = require('browser-sync');


//browserSync
gulp.task("browserSync",function(){
	browserSync({
        server: {
            //指定服务器启动根目录
            baseDir: "./"
        }
    });
    //监听任何文件变化，实时刷新页面
    gulp.watch("./*.*").on('change', browserSync.reload);
    gulp.watch("./src/**/*.*").on('change', browserSync.reload);
    gulp.watch("./src/base/**/*.*").on('change', browserSync.reload);
});

gulp.task('clean', function () {
  return gulp.src('dist', { read: false })    //src的第二个参数的{read:false}，是不读取文件,加快程序。  
    .pipe(clean());
})


gulp.task('index',['clean'],function(){  
  return gulp.src(['./src/html/*.html'])  
      .pipe(rename(function(path){  
          path.dirname += "/html";
          path.basename +='-build';  
          path.extname = ".html";  
      }))  
      .pipe(gulp.dest('dist/'))  
})  

// 单纯修改js名称
// gulp.task("mytask", ["clean"], function() {
//   let time = new Date().getTime()
//   return gulp.src(['./src/js/**/*.js'])
//   .pipe(rename(function(path) {
//     // path.dirname += "/js";
//     path.basename += "."+time;
//   }))
//   .pipe(gulp.dest('dist/')) 
// })


gulp.task('minijs',['index'], function (cb) {
   pump([
    gulp.src('./src/**/*.js'),
    babel(),
    stripDebug(),
    uglify(),
    gulp.dest('dist/')
  ],cb)

  // return gulp.src("./src/**/*.js")
  // .pipe(babel())
  // .pipe(stripDebug())
  // .pipe(uglify())
  // .pipe(revContent()) 
  // .pipe(gulp.dest('dist/'))
  // .pipe(revContent.manifest()) 
  // .pipe(gulp.dest('dist/rev'))
  // .pipe(notify("success!!!"));
});


// var minify = require('gulp-minify-css');
// gulp.task('cssmini', function () {
//     gulp.src(['src/css/*.css', '!css/*.min.css'])  //要压缩的css
//         .pipe(minify())
//         .pipe(gulp.dest('dist/css/'));
// });


// gulp.task('revFile',['minijs'],function(){  
//   //把index.html引用到的文件进行替换  
//   return gulp.src(['dist/rev/*.json','dist/html/*.html'])  
//       .pipe(revCollector({replaceReved: true}))//一定需要设置参数为true  否侧不会替换上一次的值  
//       .pipe(gulp.dest('dist/'))  
//       .pipe(notify("success!!!"))  
// }) 

// gulp.task('default',['revFile']);//默认执行函数  