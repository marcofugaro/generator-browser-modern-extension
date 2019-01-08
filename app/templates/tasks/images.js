import gulp from 'gulp'
import { paths } from '../gulpfile'


export function images() {
  return gulp.src(paths.images, { since: gulp.lastRun(images) })
    .pipe(gulp.dest('build/images'))
}
