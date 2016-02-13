const gulp = require('gulp'),
      eslint = require('gulp-eslint'),
      tape = require('gulp-tape'),
      faucet = require('faucet'),
      env = require('gulp-env');

require('dotenv').config({path: 'dot.env'});

const scripts = ['config/*.js', 'data/rooms/*.js', 'data/*.js', 'lib/**/*.js',
                  'test/*.js', 'app.js', 'gulpfile.js'];

gulp.task('lint', () => {
    return gulp.src(scripts)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('test', ['set-env'], () => {
  return gulp.src('test/*.spec.js')
    .pipe(tape({
      reporter: faucet()
    }));
});

gulp.task('set-env', () => {
  env({
    vars: {
      SERVER_ENV: 'test'
    }
  });
});

gulp.task('watch', () => {
  gulp.watch(scripts, ['lint', 'test']);
});

gulp.task('default', ['lint', 'test', 'watch'], () => {

});
