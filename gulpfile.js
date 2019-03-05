
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    uglify = require("gulp-uglify"), //сжатие js
    jshint = require("gulp-jshint"), //проверка js errors
    sourcemaps = require('gulp-sourcemaps'), //sourcemaps
    rename = require("gulp-rename"), //переименвоание файлов
    imagemin = require('gulp-imagemin'),
    csso = require('gulp-csso'),
    del = require("del"),
    runSequence = require('run-sequence'),
    babel = require('gulp-babel');
    server = require("browser-sync").create();

//директории
var path = {
    build: { //готовые после сборки файлы
        html: './build',
        js: './build/src/js/',
        css: './build/src/css/',
        img: './build/src/img',
        fonts: 'build/src/fonts'
    },
    src: { //Пути откуда брать исходники
        html: './*.html',
        js: './src/js/**/*.*',
        jsbabel: './src/forbabel/**/*.*',
        styles: './src/css/*.{scss,sass}',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*'
    },
    clearbuild: './build',
    mainPath: 'build/'
};

//ТАСКИ
gulp.task("style", function() {
    gulp.src(path.src.styles)
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({browsers: [
                "last 10 version",
                "last 6 Chrome versions",
                "last 6 Firefox versions",
                "last 6 Opera versions",
                "last 6 Edge versions"
            ]})
        ]))
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css))
        // .pipe(rename({suffix: '.min'}))
        .pipe(server.stream());
});

gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(babel({ //babel для ES
            presets: ['@babel/env']
        }))
        .pipe(plumber())
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(rename({suffix: '.min'})) //добавим суффикс .min к выходному файлу
        .pipe(gulp.dest(path.build.js)) //выгрузим готовый файл в build
        .pipe(server.stream()); //И перезагрузим сервер
});

gulp.task('image', function () {
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
        .pipe(server.stream())
});

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(server.stream());
});


//копирование директорий
gulp.task("copy", function() {
    return gulp.src([
        "src/fonts/**/*.*",
        "src/vendor/**/*.*",
        "src/templates/**.html"
    ], {
        base: "."
    })
        .pipe(gulp.dest("build"));
});

//очистка базовой директории проекта
gulp.task("clean", function() {
    return del("build");
});

//----------конец ТАСКОВ

//---------gulp (serve, build)

//собрать сборку для прода
gulp.task("build", function(fn) {
    runSequence(
        "clean",
        "copy",
        "style",
        "html",
        "image",
        "js",
        fn
    );
});

//запуск сервера
gulp.task("serve", function () {
    server.init({
        server: "build"
    });
    runSequence(
        "clean",
        "copy",
        "style",
        "html",
        "js");

    //вотчеры
    gulp.watch(path.src.js, ["js"]);
    gulp.watch(path.src.styles, ["style"]);
    gulp.watch('*.html', ['html']);

});
