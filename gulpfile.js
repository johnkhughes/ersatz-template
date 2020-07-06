// jshint node: true, esversion: 6

// Strict mode
'use strict';

// Modules
const del = require('del');
const gulp = require('gulp');
const hash = require('object-hash');

// Plugins
const autoprefixer = require('gulp-autoprefixer');
const base64 = require('gulp-base64-v2');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const filter = require('gulp-filter');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const svgo = require('gulp-svgo');
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
            ],
            images: './src/images/**/*',
            fonts: './src/fonts'
        },

        dest: {
            css: './dist/css',
            js: './dist/js',
            images: './dist/images',
            fonts: './dist/fonts'
        }
    },

    plugins: {
        autoprefixer: {
            remove: false
        },

        // Limit base64 image embeds to URLs that end with "#base64"
        base64: {
            extensions: [
                /.*#base64$/i
            ]
        },

        // Skip svgo because prefix not unique
        imagemin: [
            imagemin.mozjpeg(),
            imagemin.optipng()
        ],

        rename: {
            suffix: '.min'
        },

        sass: {
            includePaths: [
                '.'
            ],
            outputStyle: 'nested'
        },

        // Dedicated svgo step with unique file prefix, which allows images to
        // be embedded safely in HTML.
        svgo: {
            plugins: [
                {
                    prefixIds: {
                        prefix: function (node, extra) {
                            return hash(extra.path.replace(__dirname, ''));
                        }
                    }
                },
                {
                    removeViewBox: false
                }
            ]
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

function imageClean() {
    return del(config.paths.dest.images);
}

function fontClean() {
    return del(config.paths.dest.fonts);
}

function cssBuild() {
    return gulp.src(config.paths.src.css)
        .pipe(plumber())

        // Create map(s) and write uncompressed development version
        .pipe(sourcemaps.init())
        .pipe(sass(config.plugins.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.plugins.autoprefixer))
        .pipe(base64(config.plugins.base64))
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

function imageBuild() {
    return gulp.src(config.paths.src.images, {
        allowEmpty: true
    })
        .pipe(imagemin(config.plugins.imagemin))
        .pipe(svgo(config.plugins.svgo))
        .pipe(gulp.dest(config.paths.dest.images))
        .pipe(touch());
}

function fontBuild() {
    return gulp.src(config.paths.src.fonts, {
        allowEmpty: true
    })
        .pipe(gulp.dest(config.paths.dest.fonts))
        .pipe(touch());
}

// Note that imageTask runs cssTask to embed base64-encoded images
const cssTask = gulp.series(cssClean, cssBuild);
const jsTask = gulp.series(jsClean, jsBuild);
const imageTask = gulp.series(imageClean, imageBuild, cssTask);
const fontTask = gulp.series(fontClean, fontBuild);

// Combined
function watch() {
    gulp.watch(config.paths.src.css, cssTask);
    gulp.watch(config.paths.src.js, jsTask);
    gulp.watch(config.paths.src.images, imageTask);
    gulp.watch(config.paths.src.fonts, fontTask);
}

const build = gulp.parallel(jsTask, imageTask, fontTask);

// Public
exports.default = build;
exports.watch = watch;
