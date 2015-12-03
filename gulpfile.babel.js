'use strict'

/*  Dependencies
*/


import gulp from 'gulp'
import autoprefixer from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import concat from 'gulp-concat'
import imagemin from 'gulp-imagemin'
import minify from 'gulp-minify-css'
import notify from 'gulp-notify'
import sass from 'gulp-sass'
import uglify from 'gulp-uglify'
import util from 'gulp-util'
import browserSync from 'browser-sync'


const reload = browserSync.reload


/*  Configuration
*/

const sources = {
  html: 'public/**/*.html',
  css: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/img/**/*.{jpg,jpeg,png,gif,svg}'
}

const destinations = {
  css: 'public/assets/css',
  js: 'public/assets/js',
  img: 'public/assets/img'
}

const filenames = {
  js: 'main.js'
}

/*  Helpers
*/

const logError = message => {
  util.beep()
  util.log(util.colors.red('\u2718'), util.colors.red(message))
}

const logOK = message => {
  util.log(util.colors.green('\u2714'), util.colors.green(message))
}

const logInfo = message => {
  util.log(util.colors.cyan('\u279e'), util.colors.cyan(message))
}

const notification = msg => {
  gulp.src([]).pipe(notify({title: 'Gulp', message: msg}))
}


/*  Gulp tasks
*/

gulp.task('css', () => {
  gulp.src(sources.css)
    .pipe(sass())
      .on('error', err => {
        logError('An error occured in the gulp-sass plugin:\n' + err)
      })
    .pipe(autoprefixer({browsers: ['last 3 versions', 'Firefox ESR', 'Opera 12.1', 'iOS 7']}))
      .on('error', err => {
        logError('An error occured in the autoprefixer plugin:\n' + err)
      })
    .pipe(minify())
      .on('error', err => {
        logError('An error occured in the gulp-minify-css plugin:\n' + err)
      })
    .pipe(gulp.dest(destinations.css))
    .pipe(reload({stream: true}))
    .pipe(notify({title: 'Gulp', message: 'Finished compiling Sass!'}))
})

gulp.task('js', () => {
  gulp.src(sources.js)
    .pipe(babel({
      presets: ['es2015']
    }))
      .on('error', err => {
        logError('An error occured in the gulp-babel plugin:\n' + err)
      })
    .pipe(concat(filenames.js))
      .on('error', err => {
        logError('An error occured in the gulp-concat plugin:\n' + err)
      })
    .pipe(uglify())
      .on('error', err => {
        logError('An error occured in the gulp-uglify plugin:\n' + err)
      })
    .pipe(gulp.dest(destinations.js))
    .pipe(notify({title: 'Gulp', message: 'Finished exporting JavaScript!'}))
})

gulp.task('img', () => {
  gulp.src(sources.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      optimizationLevel: 3
    }))
      .on('error', err => {
        logError('An error occured in the gulp-imagemin plugin:\n' + err)
      })
    .pipe(gulp.dest(destinations.img))
})

gulp.task('serve', ['css', 'js', 'img'], () => {
  browserSync({
    server: './public'
  })

  gulp.watch(sources.css, ['css'])
  gulp.watch(sources.js, ['js'])
  gulp.watch(sources.img, ['img'])

  gulp.watch(destinations.js + '/' + filenames.js).on('change', reload)
  gulp.watch(sources.html).on('change', reload)
  gulp.watch(destinations.img + '/**/*.*').on('change', reload)
});

gulp.task('default', ['serve'])