const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('babel', function() {
    gulp.src('./src/tap.js')
        .pipe(gulpBabel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', function() {
    gulp.src([
        './libs/polyfill.min.js',
        './dist/tap.js'
    ])
        .pipe(concat('tap.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['babel', 'build']);