/*  Dependencies
*/


import gulp from 'gulp'
import imagemin from 'gulp-imagemin'
import notify from 'gulp-notify'
import sass from 'gulp-sass'
import autoprefixer from 'autoprefixer'
import postcss from 'gulp-postcss'
import sourcemaps from 'gulp-sourcemaps'
import cssnano from 'cssnano'
import util from 'gulp-util'
import browserSync from 'browser-sync'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'


const reload = browserSync.reload


/*  Configuration
*/

const filenames = {
  js: 'main.js'
}

const sources = {
  html: 'src/html/**/*.html',
  css: 'src/scss/**/*.scss',
  js: 'src/js/' + filenames.js,
  img: 'src/img/**/*.{jpg,jpeg,png,gif,svg}'
}

const destinations = {
  html: 'public',
  css: 'public/assets/css',
  js: 'public/assets/js',
  img: 'public/assets/img'
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

gulp.task('html', () => {
  gulp.src(sources.html)
    .pipe(gulp.dest(destinations.html))
})

gulp.task('css', () => {
  gulp.src(sources.css)
    .pipe(sourcemaps.init())
    .pipe(sass())
      .on('error', err => {
        logError('An error occured in the gulp-sass plugin:\n' + err)
      })
    .pipe(sourcemaps.write('.'))
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(gulp.dest(destinations.css));
})

gulp.task('js', () => {
  return browserify(sources.js, {debug: false})
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .pipe(source(filenames.js))
    .pipe(buffer())
    .pipe(gulp.dest(destinations.js));
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

gulp.task('build', ['html', 'css', 'js', 'img'])

gulp.task('serve', ['html', 'css', 'js', 'img'], () => {
  browserSync({
    server: './public'
  })

  gulp.watch(sources.html, ['html'])
  gulp.watch(sources.css, ['css'])
  gulp.watch(sources.js, ['js'])
  gulp.watch(sources.img, ['img'])

  gulp.watch(destinations.css + '/**/*.css').on('change', reload)
  gulp.watch(destinations.js + '/' + filenames.js).on('change', reload)
  gulp.watch(destinations.html + '/**/*.html').on('change', reload)
  gulp.watch(destinations.img + '/**/*.*').on('change', reload)
});

gulp.task('default', ['serve'])
