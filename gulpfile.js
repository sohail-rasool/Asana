//Load Plugins
var gulp = require('gulp'),
compass = require('gulp-compass'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
sourcemaps = require('gulp-sourcemaps'),
cleanCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
plumber = require('gulp-plumber'),
order = require("gulp-order"),
path = require('path'),
del = require('del');

//Run Tasks
//the title and icon that will be used for the Gulp notifications
var notifyInfo = {
    title: 'Gulp',
    icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = { 
    errorHandler: notify.onError({
        title: notifyInfo.title,
        icon: notifyInfo.icon,
        message: "Error: <%= error.message %>"
    })
};


//Compile, Minify SASS
gulp.task('styles', function () {
    gulp.src('assets/scss/**/style.scss')
    .pipe(sourcemaps.init())
    //Log errors to terminal
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css/main'))
    .pipe(rename({suffix: '.min'}))
    //Minify CSS
    .pipe(cleanCSS())
    .pipe(gulp.dest('css/main'))
});

function handleError(err) {
    console.log(err.toString());
}

//Minify, Concat Javascript
gulp.task('scripts', function() {
    //Includes all JS files in assets and excludes optional IE only scripts that need to be included in head
    return gulp.src(['assets/js/**/*.js', '!assets/js/optional/*.js'])
    .pipe(order([
        //Include JQuery before other scripts
        //'vendor/jquery.min.js',
        'vendor/*.js',
        'site-scripts/*.js'
    ]))
    .pipe(plumber())
    .pipe(concat('main.js'))
    //Output unminified version to help with debugging
    .pipe(gulp.dest('js/main'))
    .pipe(rename({suffix: '.min'}))
    //Concat production version
    .pipe(uglify().on('error', handleError))
    .pipe(gulp.dest('js/main/'));
});

//Clean Destination folders
gulp.task('clean', function(cb) {
    del(['css/main', 'js/main'], cb)
});

//Run all tasks
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts');
});

//Gulp Watch Task
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('assets/scss/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('assets/js/**/*.js', ['scripts']);
});