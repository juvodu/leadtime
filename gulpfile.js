var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint =  require('gulp-jshint');
var concat = require('gulp-concat');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var autoprefix = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

var scriptGlob = "www/js/*.js";
var styleGlob = "www/css/*";
var viewGlob = "www/view/*.html";
var imgGlob = "www/img/*";
var buildPath = "build/";

gulp.task('watch', ()=> {

    gulp.watch( scriptGlob, ["script"]);
    gulp.watch( viewGlob, ["view"]);
    gulp.watch( imgGlob, ["img"]);
    gulp.watch( styleGlob, ["style"]);
});

gulp.task('script', ['build-script'], ()=> {
    browserSync.reload();
});

gulp.task('view', ['build-view'], ()=> {
    browserSync.reload();
});

gulp.task('img', ['build-img'], ()=> {
    browserSync.reload();
});

/**
 * Build minified css file
 */
gulp.task('style', ()=> {

    return gulp.src(styleGlob)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefix('last 2 version', 'ie 9', 'ie 10'))    //css prefix for older browsers etc.
        .pipe(concat('build.css'))
        .pipe(gulp.dest(buildPath + "css/"))
        .pipe(browserSync.stream());
});

/**
 * Build minified js file
 */
gulp.task('build-script', ()=> {
    return gulp.src(scriptGlob)
        .pipe(plumber())
        .pipe(jshint())                         //js hint reports
        .pipe(jshint.reporter('default'))
        .pipe(uglify())                         //minify
        .pipe(concat('build.js'))               //concat
        .pipe(gulp.dest(buildPath + "js/"));
});

gulp.task('build-view', ()=> {
    return gulp.src(viewGlob)
        .pipe(plumber())
        .pipe(gulp.dest(buildPath + "view/"));
});

gulp.task('build-img', ()=> {
    return gulp.src(imgGlob)
        .pipe(plumber())
        .pipe(gulp.dest(buildPath + "img/"));
});

/**
 * Initially build hole project once
 */
gulp.task('init', ["script", "view", "img", "style"],()=> {
    gutil.log(gutil.colors.green('Gulp project build finished.'));
});

//static server
gulp.task('server', ['init'],()=> {

    browserSync.init({
        server: buildPath,
        index: "view/index.html"
    });
});

// default - start everything
gulp.task('default', [
    'server', 'watch'
]);