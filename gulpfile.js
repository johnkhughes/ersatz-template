// jshint node: true, esversion: 6

// Strict mode
'use strict';

// Modules
const del = require('del');
const gulp = require('gulp');

// Plugins
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const filter = require('gulp-filter');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const touch = require('gulp-touch-fd');
const uglify = require('gulp-uglify');

// Configuration
const cssSrc = [
    './src/scss/**/*.scss'
];

const jsSrc = [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './src/js/**/*.js'
];

const cssDest = './dist/css';
const jsDest = './dist/js';

// Tasks
function cssClean() {
    return del(cssDest);
}

function jsClean() {
    return del(jsDest);
}

function cssBuild() {
    return gulp.src(cssSrc)
        .pipe(plumber())

        // Create map(s) and write uncompressed development version
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: ['.']}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssDest))
        .pipe(touch())

        // Remove map(s) and write compressed production version
        .pipe(filter('**/*.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(csso())
        .pipe(gulp.dest(cssDest))
        .pipe(touch());
}

function jsBuild() {
    return gulp.src(jsSrc)
        .pipe(plumber())

        // Create map(s) and write uncompressed development version
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsDest))
        .pipe(touch())

        // Remove map(s) and write compressed production version
        .pipe(filter('**/*.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
        .pipe(touch());
}

// Note that imageTask runs cssTask to embed base64-encoded images
const cssTask = gulp.series(cssClean, cssBuild);
const jsTask = gulp.series(jsClean, jsBuild);

// Combined
function watch() {
    gulp.watch(cssSrc, cssTask);
    gulp.watch(jsSrc, jsTask);
}

const build = gulp.parallel(cssTask, jsTask);

// Public
exports.default = build;
exports.watch = watch;
