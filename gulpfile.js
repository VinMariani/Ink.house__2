const gulp = require('gulp')
const pug = require('pug')
const less = require('gulp-less')
const del = require('del')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const babel = require('gulp-babel') // коррекный перевод js в более старые версии для корректной работы в более старых браузерах
const uglify = require('gulp-uglify') // минификация и оптимизация js кода
const concat = require('gulp-concat') // автоматическое объединение разных файлов скриптов в один
// пути для сохранения файлов после обработки
const path = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/',
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/',
    }
}


//для обработки скриптов
function scripts() {
    return gulp.src(path.scripts.src, { // откуда возьмет скрипты
        sourcemap: true    //карта
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js')) // объединит несколько файлов в 1 и сразу даст им корректное название (также можно и в css)
    .pipe(gulp.dest(path.scripts.dest)) // куда положит скрипты
}


//для очистки каталогов
function clean() {
    return del(['dist'])
}

//обработка стилей 
function styles() {
    return gulp.src(path.styles.src) //= return gulp.src('src/styles/**/*.less')
    .pipe(less())     // из less в css
    .pipe(cleanCSS()) // минификация кода
    .pipe(rename({    // переименование файлов в едином стиле
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(gulp.dest(path.styles.dest))
}

//отслеживание изменений
function watch() {
    gulp.watch(path.styles.src, styles) // задача styles будет выполняться автоматически при изменениях в файлах по указанному пути
    gulp.watch(path.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch) // последовательное выполнение указанных задач + доп параллельное отслеживание

exports.clean = clean
exports.styles = styles
exports.watch = watch
exports.build = build
exports.default = build // при введении команды gulp такая команда (через .default) выполнится по-умолчанию
exports.scripts = scripts