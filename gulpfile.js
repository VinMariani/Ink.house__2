const gulp = require('gulp')
const gulppug = require('gulp-pug') //
const sass = require('gulp-sass')(require('sass'))
const del = require('del') // 
// const cleanCSS = require('gulp-clean-css') //
const rename = require('gulp-rename') //
const babel = require('gulp-babel') // коррекный перевод js в более старые версии для корректной работы в старых браузерах
const uglify = require('gulp-uglify') // минификация и оптимизация js кода
const concat = require('gulp-concat') // автоматическое объединение разных файлов скриптов в один
const sourcemaps = require('gulp-sourcemaps') // будет подсказывать в devtools, на какой именно строке написаны стили и др.
const imagemin = require('gulp-imagemin') // сжатие изображений
const htmlmin = require('gulp-htmlmin') // минификация и оптимизация html
const newer = require('gulp-newer') // оптимизация будет только для новых картинок
const browserSync = require('browser-sync')
const sync = require('browser-sync').create() //автоматическая перезагрузка страницы 
const path = {              // пути 
    pug: {
        src: 'src/*.pug',
        dest: 'dist'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist'
    },
    styles: {
        src: ['src/styles/**/*.sass', 'src/styles/**/*.scss'],
        dest: 'dist/css/',
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/',
    },
    images: {
        src: 'src/images/**',
        dest: 'dist/images',
    }
}

//для обработки скриптов
function scripts() {
    return gulp.src(path.scripts.src) // откуда возьмет скрипты
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    // .pipe(concat('main.min.js')) // объединит несколько файлов в 1 и сразу даст им корректное название (также можно и в css)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.scripts.dest)) // куда положит скрипты
    .pipe(sync.stream())
}

//для очистки каталогов
function clean() {
    return del(['dist/*', '!dist/images']) //будут удаляться все файлы, кроме папки img
}

//преобразование паг
function pug() {
    return gulp.src(path.pug.src)
    .pipe(gulppug({pretty: true})) 
    .pipe(gulp.dest(path.pug.dest))
    .pipe(sync.stream())
}

// оптимизация html
function html() {
    return gulp.src(path.html.src)
    .pipe(htmlmin({collapseWhitespace: true }))
    .pipe(gulp.dest(path.html.dest))
    .pipe(sync.stream())
}

//обработка стилей 
function styles() {
    return gulp.src(path.styles.src) 
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', sass.logError)      
    // .pipe(autoprefixer({ //добавление префиксов
    //     cascade: false
    // }))
    // .pipe(cleanCSS({     // минификация кода
    //     level: 2
    // }))               
    .pipe(rename({    // переименование файлов в едином стиле
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.styles.dest))
    .pipe(sync.stream())
}

//компрессия изображений + изменение только новых картинок
function img() {
    return gulp.src(path.images.src)
    .pipe(newer(path.images.dest))
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest(path.images.dest))
}

//отслеживание изменений
function watch() {
    sync.init({
        server: {
            baseDir: 'dist/'          // смотря где находится файл html
        }
    })
    gulp.watch(path.html.dest).on('change', sync.reload) // перезагрузка сервера после обновления html в папке назначения
    // gulp.watch(path.pug.dest).on('change', sync.reload) // перезагрузка сервера после обновления pug в папке назначения
    gulp.watch(path.html.src, html)
    gulp.watch(path.styles.src, styles) // задача styles будет выполняться автоматически при изменениях в файлах по указанному пути
    // gulp.watch(path.scripts.src, scripts)
    gulp.watch(path.images.src, img)
    gulp.watch(path.pug.src, pug)
}

const build = gulp.series(html, pug, gulp.parallel(styles, scripts, img), watch) // последовательное выполнение указанных задач + доп параллельное отслеживание

exports.pug = pug
exports.html = html
exports.img = img
// exports.clean = clean
exports.styles = styles
exports.watch = watch
exports.build = build
exports.default = build // при введении команды gulp такая команда (через .default) выполнится по-умолчанию
exports.scripts = scripts