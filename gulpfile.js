const gulp = require('gulp');
const eslint = require('gulp-eslint');
const tape = require('gulp-tape');
const faucet = require('faucet');
const env = require('gulp-env');

require('dotenv').config({ path: 'dot.env' });

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
      SERVER_ENV: 'test',
      LOG_LEVEL: 0
    }
  });
});

gulp.task('watch', () => {
  gulp.watch(scripts, ['lint', 'test']);
});

gulp.task('default', ['lint', 'test', 'watch']);
