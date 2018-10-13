
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
    server = require("browser-sync").create();

var path = {
    build: { //готовые после сборки файлы
        html: './build',
        js: './build/src/js/',
        css: './build/src/css/',
        img: './build/src/img',
        fonts: 'build/src/fonts'
    },
    src: { //Пути откуда брать исходники
        html: './*.{html,php}',
        js: './src/js/**/*.*',
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
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({browsers: [
                "last 10 version",
                "last 2 Chrome versions",
                "last 2 Firefox versions",
                "last 2 Opera versions",
                "last 2 Edge versions"
            ]})
        ]))
        .pipe(csso({
            restructure: true,
            sourceMap: true,
            debug: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(server.stream());
});

gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(rename({suffix: '.min'})) //добавим суффикс .min к выходному файлу
        .pipe(gulp.dest(path.build.js)) //выгрузим готовый файл в build
        .pipe(server.stream()); //И перезагрузим сервер
});

gulp.task('image', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true, //сжатие .jpg
            svgoPlugins: [{removeViewBox: false}], //сжатие .svg
            interlaced: true, //сжатие .gif
            optimizationLevel: 7 //степень сжатия от 0 до 7
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(server.stream())
});

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(server.stream());
});

gulp.task('php', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(server.stream());
});

//запуск сервера
gulp.task("serve", function() {
    server.init({
        server: "build"
    });

    //вотчеры
    gulp.watch(path.src.js, ["js"]);
    gulp.watch(path.src.styles, ["style"]);
    gulp.watch('*.html', ['html']);

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

//запуск билда
gulp.task("build", function(fn) {
    runSequence(
        "clean",
        "copy",
        "image",
        "style",
        "html",
        "php",
        "js",
        fn
    );
});
