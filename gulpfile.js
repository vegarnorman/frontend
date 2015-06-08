/*  Dependencies
*/

var gulp =          require('gulp');
var autoprefixer =  require('gulp-autoprefixer');
var concat =        require('gulp-concat');
var imagemin =      require('gulp-imagemin');
var minify =        require('gulp-minify-css');
var notify =        require('gulp-notify');
var sass =          require('gulp-sass');
var uglify =        require('gulp-uglify');
var util =          require('gulp-util');

var browserSync =   require('browser-sync');
var reload =        browserSync.reload;


/*  Configuration
*/

var sources = {
  html: 'public/**/*.html',
  css: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/img/**/*.{jpg,jpeg,png,gif,svg}'
};

var destinations = {
  css: 'public/assets/css',
  js: 'public/assets/js',
  img: 'public/assets/img'
};

var filenames = {
  js: 'main.js'
};

/*  Helpers
*/

function logError(message) {
  util.beep();
  util.log(util.colors.red('\u2718'), util.colors.red(message));
}

function logOK(message) {
  util.log(util.colors.green('\u2714'), util.colors.green(message));
}

function logInfo(message) {
  util.log(util.colors.cyan('\u279e'), util.colors.cyan(message));
}

function notification(msg) {
  gulp.src([]).pipe(notify({title: 'Gulp', message: msg}));
}


/*  Gulp tasks
*/

gulp.task('css', function() {
  gulp.src(sources.css)
    .pipe(sass())
      .on('error', function(err) {
        logError('An error occured in the gulp-sass plugin:\n' + err);
      })
    .pipe(autoprefixer({browsers: ['last 3 versions', 'Firefox ESR', 'Opera 12.1', 'iOS 7']}))
      .on('error', function(err) {
        logError('An error occured in the autoprefixer plugin:\n' + err);
      })
    .pipe(minify())
      .on('error', function(err) {
        logError('An error occured in the gulp-minify-css plugin:\n' + err);
      })
    .pipe(gulp.dest(destinations.css))
    .pipe(reload({stream: true}))
    .pipe(notify({title: 'Gulp', message: 'Finished compiling Sass!'}));
});

gulp.task('js', function() {
  gulp.src(sources.js)
    .pipe(concat(filenames.js))
      .on('error', function(err) {
        logError('An error occured in the gulp-concat plugin:\n' + err);
      })
    .pipe(uglify())
      .on('error', function(err) {
        logError('An error occured in the gulp-uglify plugin:\n' + err);
      })
    .pipe(gulp.dest(destinations.js))
    .pipe(notify({title: 'Gulp', message: 'Finished exporting JavaScript!'}));
});

gulp.task('img', function() {
  gulp.src(sources.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      optimizationLevel: 3
    }))
      .on('error', function(err) {
        logError('An error occured in the gulp-imagemin plugin:\n' + err);
      })
    .pipe(gulp.dest(destinations.img));
});

gulp.task('serve', ['css', 'js', 'img'], function() {
  browserSync({
    server: './public'
  });

  gulp.watch(sources.css, ['css']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(sources.img, ['img']);

  gulp.watch(destinations.js + '/' + filenames.js).on('change', reload);
  gulp.watch(destinations.html).on('change', reload);
  gulp.watch(destinations.img + '/**/*.*').on('change', reload);
});

gulp.task('default', ['serve']);
