const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

gulp.task('babel', function () {
    gulp.src('./src/tap.js')
        .pipe(gulpBabel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('uglify', function () {
    gulp.src('./src/tap.js')
        .pipe(gulpBabel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['babel', 'uglify']);