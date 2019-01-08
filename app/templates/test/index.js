import path from 'path'
import test from 'ava'
import puppeteer from 'puppeteer'

let browser
let page

test.before('start up headless chrome', async t => {
  const extensionPath = path.resolve(__dirname, '../build')

  browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  })
  page = await browser.newPage()
})

test.serial(t => {
  t.pass()
})

test.after.always('close headless chrome', async t => {
  await browser.close()
})
