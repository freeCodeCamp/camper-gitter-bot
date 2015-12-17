const gulp = require('gulp'),
      eslint = require('gulp-eslint'),
      tape = require('gulp-tape'),
      faucet = require('faucet'),
      env = require('gulp-env');

require('dotenv').config({path: 'dot.env'});

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
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

gulp.task('default', ['lint', 'set-env', 'test'], () => {

});
