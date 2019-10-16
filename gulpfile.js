const path = require('path')
const { src, dest, parallel } = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

const jsArr = [
  './src/instance.js',
  './src/main.js',
  './src/reg.js',
  './src/validate.js'
]

function build() {
  return src(jsArr, { sourcemaps: false })
    .pipe(concat('javascript-utils.js'))
    .pipe(babel({
      "presets": ["@babel/preset-env"]
    }))
    .pipe(dest('build', { sourcemaps: false }))
}

exports.build = build;
exports.default = parallel(build);
