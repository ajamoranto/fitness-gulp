'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
//w3c vars
var path = require('path');
var gutil = require('gulp-util');
var validate = require('gulp-w3c-css');

//htmlhint var
var htmlhint = require("gulp-htmlhint");

//babel const
const babel = require('gulp-babel');

//beautify var
var beautify = require('gulp-beautify');

//uglify var
var uglify = require('gulp-uglify');
var pump = require('pump');

//htmlmin
var htmlmin = require('gulp-htmlmin');

//cleancss
let cleanCSS = require('gulp-clean-css');




var srcPath = path.join(__dirname, './assets/css/**/*.css');
var dstPath = path.join(__dirname, '././assets/css');
var errPath = path.join(__dirname, '././assets/err');
var prodPath = path.join(__dirname, '././assets/prod');


//sass
gulp.task('sass', function() {
  return gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/css/'));
});

gulp.task('watch', function () {
  gulp.watch('./assets/sass/**/*.scss', ['sass']);
});


//w3c gulp
gulp.task('w3ccss', function(){
    gulp.src(srcPath)
    .pipe(validate())
    .pipe(gulp.dest(errPath));
})

//htmlhint gulp
gulp.task('htmlhint', function(){
    gulp.src("./*.html")
    .pipe(htmlhint())
})

// //babel gulp
gulp.task('babel', () =>
gulp.src('assets/js/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest(prodPath))
);

//beautify
gulp.task('beautify', function() {
    gulp.src('./assets/js/*.js')
      .pipe(beautify({indent_size: 2}))
      .pipe(gulp.dest('./public/'))
  });

//uglify
gulp.task('compress', function (cb) {
    pump([
          gulp.src('assets/js/*.js'),
          uglify(),
          gulp.dest(prodPath)
      ],
      cb
    );
  });

//htmlMin
gulp.task('minify', function() {
    return gulp.src('./*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(prodPath));
  });

//cleanCss
  gulp.task('minify-css', () => {
    return gulp.src('assets/css/*.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest(prodPath));
  });









//css tasks
gulp.task('cssTasks', ['sass', 'w3ccss']);
//extra
gulp.task('cleanCss', ['minify-css']);

//js task
gulp.task('jsTasks', ['babel', 'beautify']);
//extra
gulp.task('makeUgly', ['compress']);

//html task
gulp.task('htmlTasks', ['htmlhint']);
//extra
gulp.task('htmlMin', ['minify']);

gulp.task('default', ['cssTasks', 'htmlTasks', 'jsTasks']);

gulp.task('prodReady', ['cleanCss', 'makeUgly', 'htmlMin']);