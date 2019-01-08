import path from 'path'
import test from 'ava'
import helpers from 'yeoman-test'
import assert from 'yeoman-assert'
import pify from 'pify'

let generator

test.beforeEach(async () => {
	await pify(helpers.testDirectory)(path.join(__dirname, 'tmp'))
	generator = helpers.createGenerator('browser-modern-extension:app', ['../app'], null, { skipInstall: true })
  generator.run = pify(generator.run.bind(generator))
})

test.serial('generates expected files', async () => {
	helpers.mockPrompt(generator, {
    githubUsername: 'testuser',
  })

	await generator.run()

	assert.file([
    '.git',
    'src/images/icon.png',
    'src/manifest.json',
    'tasks/bundle.js',
    'tasks/clean.js',
    'tasks/images.js',
    'tasks/index.js',
    'tasks/manifest.js',
    'tasks/markup.js',
    'tasks/scripts.js',
    'tasks/styles.js',
    'tasks/watch.js',
    'utils/autoreload.js',
		'.babelrc',
		'.editorconfig',
    '.env.example',
    '.env',
    '.eslintignore',
    '.eslintrc',
		'.gitattributes',
		'.gitignore',
		'.prettierignore',
		'.prettierrc',
		'.stylelintrc',
		'.travis.yml',
    'gulpfile.js',
    'LICENSE',
		'package.json',
		'README.md',
	])
})

test.serial('uses the prompted fields', async () => {
	helpers.mockPrompt(generator, {
		title: 'test title',
		description: 'desc',
		githubUsername: 'testuser',
		website: 'test.com',
	})

	await generator.run()

	assert.jsonFileContent('package.json', { name: 'test-title' })
	assert.jsonFileContent('src/manifest.json', { name: 'test title' })
	assert.jsonFileContent('package.json', { description: 'desc' })
  assert.jsonFileContent('src/manifest.json', { description: 'desc' })
  assert.jsonFileContent('src/manifest.json', { homepage_url: 'https://github.com/testuser/test-title' })
	assert.fileContent('README.md', /> desc/)
	assert.fileContent('LICENSE', /(test.com)/)
})

test.serial('defaults to superb description', async () => {
	helpers.mockPrompt(generator, {
		githubUsername: 'testuser',
	})

	await generator.run()

	assert.fileContent('package.json', /"description": "My .+ extension",/)
	assert.fileContent('README.md', /> My .+ extension/)
})

test.serial('action and actionType options work', async () => {
	helpers.mockPrompt(generator, {
    action: true,
    actionType: 'Always (Browser Action)',
		githubUsername: 'testuser',
	})

	await generator.run()

	assert.jsonFileContent('src/manifest.json', { browser_action: { default_popup: 'popup.html' } })
	assert.file([
    'src/popup.html',
    'src/popup.js',
    'src/popup.scss',
  ])
})

test.serial('optionPage option works', async () => {
	helpers.mockPrompt(generator, {
    optionPage: true,
		githubUsername: 'testuser',
	})

	await generator.run()

	assert.jsonFileContent('src/manifest.json', { options_ui: { page: 'options.html' } })
	assert.file([
    'src/options.html',
    'src/options.js',
    'src/options.scss',
  ])
})

test.serial('contentScripts option works', async () => {
	helpers.mockPrompt(generator, {
    contentScripts: true,
		githubUsername: 'testuser',
	})

	await generator.run()

	assert.jsonFileContent('src/manifest.json', { content_scripts: [{ js: ['content.js'] }] })
	assert.file([
    'src/content.js',
  ])
})

test.serial('backgroundScripts option works', async () => {
	helpers.mockPrompt(generator, {
    backgroundScripts: true,
		githubUsername: 'testuser',
	})

	await generator.run()

	assert.jsonFileContent('src/manifest.json', { background: { scripts: ['background.js'] } })
	assert.file([
    'src/background.js',
  ])
})

test.serial('passing false to isOpenSource works', async () => {
	helpers.mockPrompt(generator, {
    isOpenSource: false,
  })

	await generator.run()

	assert.noFile([
    'LICENSE',
    '.travis.yml',
	])
  assert.noFileContent('src/manifest.json', /"homepage_url"/)
  assert.noJsonFileContent('package.json', { license: 'MIT' })
})

test.serial('yarn option works', async () => {
  helpers.mockPrompt(generator, {
    yarn: true,
  })

  await generator.run()

  assert.fileContent('.travis.yml', /yarn: true/)
  assert.fileContent('.travis.yml', /yarn build/)
  assert.fileContent('.travis.yml', /yarn test/)
})
