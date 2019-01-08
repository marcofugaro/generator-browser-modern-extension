import gulp from 'gulp'
import { paths } from '../gulpfile'
import del from 'del'


export function clean() {
  return del(['build'])
}
