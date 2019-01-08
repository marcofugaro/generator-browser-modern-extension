import browser from 'webextension-polyfill'
import initSimpleSettings from './lib/simple-settings'

document.addEventListener('DOMContentLoaded', () => {
  initSimpleSettings()
})
