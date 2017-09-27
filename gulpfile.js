const child        = require('child_process');
const browserSync  = require('browser-sync').create();

const gulp         = require('gulp');
const concat       = require('gulp-concat');
const sass         = require('gulp-sass');
const cssnano      = require('gulp-cssnano');
const autoprefix   = require('gulp-autoprefixer');
const gutil        = require('gulp-util');

const siteRoot     = '_site';
const cssFiles     = '_app/_css/**/master.scss';

gulp.task('test', function() {
  console.log('Hello, Test');
});


gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(autoprefix('last 2 versions'))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('_app/assets'));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);

});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }

    // proxy: "192.168.1.109"

  });

  gulp.watch(cssFiles, ['css']);
});


gulp.task('default', ['css', 'jekyll', 'serve']);