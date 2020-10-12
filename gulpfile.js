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
const config = {
    paths: {
        src: {
            css: [
                './src/scss/**/*.scss'
            ],
            js: [
                './node_modules/jquery/dist/jquery.js',
                './node_modules/bootstrap/dist/js/bootstrap.js',
                './src/js/**/*.js'
            ]
        },
        dest: {
            css: './dist/css',
            js: './dist/js'
        }
    },
    plugins: {
        autoprefixer: {
            remove: false
        },
        rename: {
            suffix: '.min'
        },
        sass: {
            includePaths: [
                '.'
            ],
            outputStyle: 'nested'
        }
    }
};

// Tasks
function cssClean() {
    return del(config.paths.dest.css);
}

function jsClean() {
    return del(config.paths.dest.js);
}

function cssBuild() {
    return gulp.src(config.paths.src.css)
        .pipe(plumber())

        // Create map(s) and write uncompressed development version
        .pipe(sourcemaps.init())
        .pipe(sass(config.plugins.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.plugins.autoprefixer))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.dest.css))
        .pipe(touch())

        // Remove map(s) and write compressed production version
        .pipe(filter('**/*.css'))
        .pipe(rename(config.plugins.rename))
        .pipe(csso())
        .pipe(gulp.dest(config.paths.dest.css))
        .pipe(touch());
}

function jsBuild() {
    return gulp.src(config.paths.src.js)
        .pipe(plumber())

        // Create map(s) and write uncompressed development version
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.dest.js))
        .pipe(touch())

        // Remove map(s) and write compressed production version
        .pipe(filter('**/*.js'))
        .pipe(rename(config.plugins.rename))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dest.js))
        .pipe(touch());
}

// Note that imageTask runs cssTask to embed base64-encoded images
const cssTask = gulp.series(cssClean, cssBuild);
const jsTask = gulp.series(jsClean, jsBuild);

// Combined
function watch() {
    gulp.watch(config.paths.src.css, cssTask);
    gulp.watch(config.paths.src.js, jsTask);
}

const build = gulp.parallel(cssTask, jsTask);

// Public
exports.default = build;
exports.watch = watch;
