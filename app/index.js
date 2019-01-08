const Generator = require('yeoman-generator')
const _ = require('lodash')
const superb = require('superb')
const normalizeUrl = require('normalize-url')
const humanizeUrl = require('humanize-url')

module.exports = class extends Generator {
	init() {
		return this.prompt([{
			name: 'title',
			message: 'What do you want to name your extension?',
			default: _.startCase(this.appname),
      validate: prompt => prompt.length <= 45 ? true : 'The name must not exceed 45 characters',
		}, {
			name: 'description',
			message: `What is your extension's description?`,
			default: `My ${superb.random()} extension`,
      validate: prompt => prompt.length <= 132 ? true : 'The description must not exceed 132 characters',
		}, {
			name: 'action',
      type: 'confirm',
			message: 'Do you need the little popup window in the browser extensions toolbar? (Browser/Page Action)',
      default: false,
		}, {
      name: 'actionType',
      type: 'list',
      message: 'Do you want the popup to be enabled only on certain pages or always?',
      choices: [
        'Always (Browser Action)',
        'Only on certain pages (Page Action)',
      ],
      filter: prompt => prompt.toLowerCase().includes('browser') ? 'browser' : 'page',
      when: answers => answers.action,
    }, {
			name: 'optionPage',
      type: 'confirm',
			message: 'Do you need an options page?',
      default: false,
		}, {
			name: 'contentScripts',
      type: 'confirm',
			message: 'Do you need scripts that are activated when you visit certain pages? (Content Scripts)',
      default: false,
		}, {
			name: 'backgroundScripts',
      type: 'confirm',
			message: 'Do you need scripts that stay always active in the background? (Background Scripts)',
      default: false,
		}, {
			name: 'isOpenSource',
      type: 'confirm',
			message: 'Do you wish to open-source the extension and put it on github?',
			default: true,
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username (or organization)?',
			store: true,
      validate: prompt => prompt.length > 0 ? true : 'You have to provide a username',
      when: answers => answers.isOpenSource,
		}, {
			name: 'website',
			message: 'What is the URL of your website?',
			store: true,
			filter: prompt => prompt ? humanizeUrl(normalizeUrl(prompt)) : null,
      when: answers => answers.isOpenSource,
		}, {
			name: 'yarn',
      type: 'confirm',
			message: 'Would you like to use Yarn in place of npm?',
      default: true,
      store: true,
		}]).then((props) => {
      const {
        title,
        description,
        action,
        optionPage,
        contentScripts,
        backgroundScripts,
        isOpenSource,
        githubUsername,
        yarn,
      } = props
      let { website, actionType } = props

      // these are the filters, workaround for issue
      // https://github.com/yeoman/yeoman-test/issues/29
      if (process.env.NODE_ENV === 'test') {
        actionType = action && actionType.toLowerCase().includes('browser') ? 'browser' : 'page',
        website = website ? humanizeUrl(normalizeUrl(website)) : null
      }

			this.templateVariables = {
        title,
        kebabTitle: _.kebabCase(title),
        description,
        action,
        actionType,
        optionPage,
        contentScripts,
        backgroundScripts,
        isOpenSource,
				githubUsername,
				name: this.user.git.name(),
				email: this.user.git.email(),
				website,
        yarn,
			}

			this.fs.copyTpl(
        `${this.templatePath()}/**`,
        this.destinationPath(),
        this.templateVariables
      )

      const mv = (from, to) => this.fs.move(this.destinationPath(from), this.destinationPath(to))
      const cp = (from, to) => this.fs.copy(this.destinationPath(from), this.destinationPath(to))
      const rm = (file) => this.fs.delete(this.destinationPath(file))

      mv('babelrc', '.babelrc')
      mv('eslintignore','.eslintignore')
      mv('eslintrc', '.eslintrc')
  		mv('prettierignore','.prettierignore')
  		mv('prettierrc','.prettierrc')
      mv('editorconfig', '.editorconfig')
      mv('env.example', '.env.example')
      cp('.env.example', '.env')
			mv('gitattributes', '.gitattributes')
			mv('gitignore', '.gitignore')
      mv('stylelintrc','.stylelintrc')
			mv('_package.json', 'package.json')
      mv('travis.yml', '.travis.yml')

      if (!isOpenSource) {
        rm('LICENSE')
        rm('.travis.yml')
      }
      if (!action) {
        rm('src/popup.*')
      }
      if (!optionPage) {
        rm('src/options.*')
      }
      if (!contentScripts) {
        rm('src/content.js')
      }
      if (!backgroundScripts) {
        rm('src/background.js')
      }

      rm('.yo-rc.json')
		})
	}

  git() {
		this.spawnCommandSync('git', ['init'])
	}

	install() {
    if (this.templateVariables.yarn) {
      this.yarnInstall()
    } else {
      this.npmInstall()
    }
	}
}
