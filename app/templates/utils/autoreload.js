import io from 'socket.io-client'

// only developing the extension on chrome is supported,
// if you want to develop an extension on firefox check out
// https://github.com/mozilla/web-ext
function reloadExtension() {
  chrome.runtime.reload()
}

const socket = io(`http://localhost:${process.env.WEBSOCKET_PORT}`)
socket.on('file changed', cb => {
  reloadExtension()
  cb()
})
