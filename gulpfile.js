const path = require('path');
const gulp = require('gulp');
const del = require('del');

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const nunjucks = require('gulp-nunjucks-render');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();

const production = false;

// preprocess scss
gulp.task('scss', function () {
    gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 10 versions']
        }))
        .pipe(gulpif(production, minifycss()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css/'))
        .pipe(browserSync.stream());
});

// optimize images
gulp.task('imagemin', function () {
    gulp.src('src/img/*.(jpg|gif|png)')
    .pipe(imagemin())
    .pipe(gulp.dest('public/img/'))
    .pipe(browserSync.stream());
});

// uglify js and transpile to es5
gulp.task('js', function () {
    gulp.src('src/js/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('public/js/'))
    .pipe(browserSync.stream());
});

// nunjuckd templating
gulp.task('nunjucks', function () {
    gulp.src('src/templates/*.njk')
        .pipe(nunjucks({
            path: 'src/templates/'
        }))
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.stream());
});

// remove puclic folder
gulp.task('del', function () {
    del('public')
    .pipe(browserSync.stream());
});

// live server
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './public/'
        }
    })
});

gulp.task('default', function () {
    console.log(typeof gulp);
});

// watch .scss, .js, .njk and images for change
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/templates/**/*.njk', ['nunjucks']);
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/img/*', ['imagemin']);
});