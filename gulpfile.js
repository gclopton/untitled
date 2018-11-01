var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concatScripts = require('gulp-concat');
var merge= require('merge-stream');
var prettify = require('gulp-jsbeautifier');


var SOURCEPATHS = {
    sassSource: 'src/scss/*.scss'
};

var APPPATH = {
    root: 'app',
    css: 'app/css',
    js: 'app/js'
};
//##############################################################################
//Gulp Clean: removes any html files in the app folder (except for index.html)
gulp.task('clean-html', function(){
    return gulp.src(['app/*.html','!app/index.html'], {read:false, force:true})
        .pipe(clean())
});
//##############################################################################

//###############################################################################
//AutoPrefixer:Takes all sass files from the src/scss folder and adds browser prefixes to them
gulp.task('sass', function () {
    var bootstrapCSS = gulp.src(['node_modules/bootstrap/dist/css/bootstrap.css']);
    var sassFiles;

    sassFiles = gulp.src('src/scss/app.scss')
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

    return merge(sassFiles, bootstrapCSS)
        .pipe(concatScripts('app.css'))
        .pipe(gulp.dest('app/css'));
});
//You have the option of changing expanded to compressed. This will compress your css file. Other options are nested and compact.
//#################################################################################
//browser-sync: takes all css, html, and js files from the app/css, app, and app/js folders respectively and loads them in the local serer
gulp.task('serve', ['sass'], function () {
    browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', 'app/js/*.js'], {
        server: {
            baseDir: APPPATH.root
        }
    })
});
//###################################################################################
//This is a gulp task that copies the app/index.html file and sends the copy to the src folder. Any change made to the original file
//is reflected in the new file
gulp.task('copyHtml', function(){
    gulp.src('app/index.html')
        .pipe(gulp.dest('src'));
});
//##################################################################################
//This is a gulp task that copies javascript files from the src folder to the app folder
gulp.task('copyScript',function(){
    gulp.src('src/*.js')
        .pipe(gulp.dest('app'));
});


//################################################################################################
//Watches all sass files in the src/scss for changes and loads them the to local server
gulp.task('watch', ['serve', 'sass','concatScripts'], function () {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
});

gulp.task('default', ['watch']);

//########################################################################################
//gulp-concat
//#######################################################################################
gulp.task('concatScripts', function(){
    return gulp.src(['app/js/bootstrap.min.js','app/js/jquery.min.js','app/js/mustache.min.js'])
        .pipe(concatScripts('concatenated.js'))
        .pipe(browserify())
        .pipe(gulp.dest('app/js'));
});
//###########################################################################
//gulp-jsbeautifier
//###########################################################################
gulp.task('prettify', function(){
    gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js','node_modules/mustache/mustache.min.js','node_modules/jquery/dist/jquery.min.js','node_modules/popper.js/dist/popper.min.js'])
        .pipe(prettify())
        .pipe(gulp.dest('app/js'));
});
