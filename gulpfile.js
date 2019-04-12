'use strict';

const gulp = require('gulp'),
    pug = require('gulp-pug'),
    scss = require('gulp-scss'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    spritesmith = require('gulp.spritesmith'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require("gulp-babel"),
    webpack = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    webpackConfig = require("./webpack.config.js");


// ==PATHS==

const paths = {
    root: {
        img: 'src/img/**/*',
        pug: 'src/pug/*.pug',
        css: ['src/css/*.css', '!src/css/*.min.css'],
        scss: ['src/scss/style.scss', '!src/scss/blocks/*.scss'],
        js: 'src/js/src/*',
        html: './src/*.html',
        mincss: 'src/css/**/*.min.css',
        minjs: 'src/js/**/*.min.js',
        fonts: 'src/fonts/**/*'
    },
    pictures: {
        icons: 'src/img/src/icons/*.png',
        svg: './src/img/src/icons/*.svg'
    },
    dest: {
        icons: 'src/img/icons',
        sprite: 'src/scss/components',
        img: 'src/img/',
        src: './src/',
        css: 'src/css',
        js: 'src/js/'
    },
    build: {
        css: './build/css',
        js: './build/js',
        fonts: 'build/fonts',
        img: 'build/img'
    },
    clean: {
        build: './build',
        img: 'build/img/src/'

    },
    watch :{


    }


};

// ==FUNCTIONS==


//compilation
function pugCompile() {
    return gulp.src(paths.root.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(paths.dest.src))
}


function browserS() {
    browserSync({
        server: {
            baseDir: 'src',
            proxy: "localhost:3000"
        },
        notify: false
    });
}




function styles() {
    return gulp.src(paths.root.scss)
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer(['last 15 versions', '> 0.1%'], {cascade: true}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min',
            dirname: ""
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest.css))
        .pipe(browserSync.reload({stream: true}))
}



function scripts() {
    return gulp.src(paths.root.js)
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(browserSync.reload({stream: true}))
}



//build

function clean() {
    return del.sync(paths.clean.build);

}

function html() {
    return gulp.src(paths.root.html)
        .pipe(gulp.dest(paths.build.build));
}

function css() {
    return gulp.src(paths.root.mincss)
        .pipe(gulp.dest(paths.build.css));
}

function js() {
    return gulp.src(paths.root.minjs)
        .pipe(gulp.dest(paths.build.js));
}

function fonts() {
    return gulp.src(paths.root.fonts)
        .pipe(gulp.dest(paths.build.fonts));
}

function img() {
    return gulp.src(paths.root.img)
        .pipe(gulp.dest(paths.build.img));
}


// ==TASKS==

//images

gulp.task('sprite', function () {

    let spriteData = gulp.src(paths.pictures.icons).pipe(spritesmith({
        imgName: 'icons.png',
        cssName: '_sprite.scss',
        imgPath: '../img/icons/sprite.png',
        padding: 1
    }));

    let stylStream = spriteData.css
        .pipe(gulp.dest(paths.dest.sprite));


    let imgStream = spriteData.img
        .pipe(gulp.dest(paths.dest.icons));
    return spriteData;

});
gulp.task('svg', function () {
    return gulp.src(paths.pictures.svg)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                // $('[fill]').removeAttr('fill');
                // $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        // .pipe(svgSprite({
        //     mode: {
        //         symbol: {
        //             icons: "icons.svg"
        //         }
        //     }
        // }))
        .pipe(gulp.dest(paths.dest.icons));
});


gulp.task('optimize', function () {

    return gulp.src(paths.root.img)
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5

        }))
        .pipe(gulp.dest(paths.dest.img));
});

//watch
gulp.task('watch', gulp.series(styles, pugCompile, scripts, gulp.parallel(browserS, function () {
    gulp.watch('src/scss/**/*.scss', gulp.series(styles));
    gulp.watch(["src/pug/**/*.pug", 'src/pug/blocks/*.html'], gulp.series(pugCompile)).on('change', browserSync.reload);
    gulp.watch('src/js/src/*', gulp.series(scripts));
})));


//build
gulp.task('build', gulp.series(clean, css, js, fonts, img, html, function () {
    return  del.sync(paths.build.img);

}));







