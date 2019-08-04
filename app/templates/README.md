# <%= kebabTitle %><% if (isOpenSource) { %> [![Build Status][travis-image]][travis-url]<% } %>

> <%= description %>

## Install

#### [Chrome extension]()
#### [Firefox add-on]()

## Development

- `<%= yarn ? 'yarn' : 'npm' %> start` to compile and watch the files for changes.

  To enable the autoreload on chrome:

  1. Go to `chrome://extensions/`
  1. Make sure **Developer mode** is on
  1. Click **Load unpacked** and choose the **build/** folder

  Instead, if you want to develop on firefox, check out [web-ext](https://github.com/mozilla/web-ext).

- `<%= yarn ? 'yarn' : 'npm run' %> build` to just compile the files.
- `<%= yarn ? 'yarn' : 'npm run' %> bundle` to compile the files and put them in a `.zip`, ready to be published.

<% if (isOpenSource) { %>
[travis-image]: https://travis-ci.org/<%= githubUsername %>/<%= kebabTitle %>.svg?branch=master
[travis-url]: https://travis-ci.org/<%= githubUsername %>/<%= kebabTitle %>
<% } %>
