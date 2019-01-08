# generator-browser-modern-extension [![Build Status][travis-image]][travis-url]

> Scaffold out a boilerplate for creating a browser extension with up-to-date tools and autoreload of the extension

The boilerplate repo is [here](https://github.com/marcofugaro/browser-modern-extension-boilerplate).

## QUESTIONS GIF

## Features

This project is born because of the lack of browser extension starter kits which aren't from 2013 and don't use bower.

[Gulp 4](https://github.com/gulpjs/gulp) is used to manage all the tasks and wire the tools together, it was chosen because it's easily hackable and configurable, you can make it fit and scale with your wildest browser extension!

It uses [webpack](https://webpack.js.org/) to bundle javascript and [SCSS](http://sass-lang.com/) as a preprocessor. [Babel](http://babeljs.io/) transpiles all the future js stuff that hasn't landed in chrome yet, and there are customizable [eslint](https://eslint.org/) and [stylelint](https://stylelint.io/) config files.

The development mode has **autoreload** of the chrome extension, meaning that when you change a file, the extension is loaded again in chrome! 🔥

It comes with the [webextension-polyfill](https://github.com/mozilla/webextension-polyfill), which basically lets you write async/await code instead of the callback hell of the chrome extension apis. 💣

## AUTORELOAD SCREENSHOT

It also bundles your extension when you're done, ready to be pusblished to the extension store!

## BUNDLE SCREENSHOT

## Install

```bash
npm install -g yo
npm install -g generator-browser-modern-extension
```

## Usage

```bash
yo browser-modern-extension
```
or just
```bash
yo
```
and select `Browser Modern Extension`.

## License

MIT © [Marco Fugaro](marcofugaro.it)


[travis-image]: https://travis-ci.org/marcofugaro/generator-chrome-modern-extension.svg?branch=master
[travis-url]: https://travis-ci.org/marcofugaro/generator-chrome-modern-extension
