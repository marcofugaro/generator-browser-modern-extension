import gulp from 'gulp'
import { paths } from '../gulpfile'


export function markup() {
  return gulp.src(paths.markup, { allowEmpty: true, since: gulp.lastRun(markup) })
    .pipe(gulp.dest('build'))
}
