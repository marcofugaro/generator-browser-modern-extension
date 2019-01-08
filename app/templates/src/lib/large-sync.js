// original code from the outdated chrome-storage-largeSync
// https://github.com/dtuit/chrome-storage-largeSync
import browser from 'webextension-polyfill'
import LZString from 'lz-string'

if (browser.storage?.sync === undefined) {
  throw new Error(
    '[largeSync] - browser.storage.sync is undefined, check that the "storage" permission included in your manifest.json',
  )
}

const storage = browser.storage.sync

const keyPrefix = 'LS'

const maxBytes = storage.QUOTA_BYTES
const maxBytesPerKey = storage.QUOTA_BYTES_PER_ITEM

function isObject(obj) {
  return obj.constructor.name === 'Object'
}

function split(obj, maxLength = maxBytesPerKey) {
  const keys = getKeys(obj)

  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      const str = LZString.compressToBase64(JSON.stringify(obj[key]))
      const max = calculateMaxLength(key, maxLength)

      let j = 0
      for (let offset = 0; offset < str.length; offset += max, j++) {
        acc[getStorageKey(key, j)] = str.substring(offset, offset + max)
      }

      acc[getStorageKey(key, 'meta')] = {
        key,
        min: 0,
        max: j,
        hash: basicHash(str),
      }
    }

    return acc
  }, {})
}

function reconstruct(splitObjects, keys = extractKeys(splitObjects)) {
  return keys.reduce((acc, key) => {
    let rejoined = ''

    const meta = splitObjects[getStorageKey(key, 'meta')]

    if (meta !== 'undefined') {
      for (let j = 0; j < meta.max; j++) {
        if (splitObjects[getStorageKey(key, j)] === undefined) {
          throw new Error('[largeSync] - partial string missing, object cannot be reconstructed.')
        }
        rejoined += splitObjects[getStorageKey(key, j)]
      }
      acc[key] = JSON.parse(LZString.decompressFromBase64(rejoined))
    }

    return acc
  }, {})
}

function getStorageKey(key, postfix) {
  return `${keyPrefix}__${key}.${postfix}`
}

function getRequestKeys(keys) {
  return getKeys(keys).flatMap(key => {
    const ret = []
    for (let j = 0; j < maxBytes / maxBytesPerKey; j++) {
      ret.push(getStorageKey(key, j))
    }
    ret.push(getStorageKey(key, 'meta'))

    return ret
  })
}

function calculateMaxLength(key, maxLength) {
  return maxLength - (keyPrefix.length + key.length + 10)
}

function getKeys(keys) {
  if (!isObject(keys) && typeof keys !== 'string' && !Array.isArray(keys)) {
    throw new TypeError(`[largeSync] - ${keys} must be of type "Object", "Array" or "string"`)
  }

  if (isObject(keys)) {
    return Object.keys(keys)
  } else {
    return Array.from(keys)
  }
}

function extractKeys(splitObjects) {
  return Object.keys(splitObjects)
    .map(x => {
      const match = x.match(`${keyPrefix}__(.*?)\.meta`)

      if (match !== null) {
        return match[1]
      }
    })
    .filter(Boolean)
}

function basicHash(str) {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export default {
  QUOTA_BYTES: maxBytes,
  QUOTA_BYTES_PER_ITEM: maxBytes,
  QUOTA_BYTES_PER_KEY: maxBytesPerKey,

  MAX_ITEMS: storage.MAX_ITEMS,
  MAX_WRITE_OPERATIONS_PER_HOUR: storage.MAX_WRITE_OPERATIONS_PER_HOUR,
  MAX_WRITE_OPERATIONS_PER_MINUTE: storage.MAX_WRITE_OPERATIONS_PER_MINUTE,

  async get(keys) {
    const objKeys = getKeys(keys)
    const reqKeys = getRequestKeys(objKeys)

    const items = await storage.get(reqKeys)
    return reconstruct(items)
  },

  async set(items) {
    if (items === null || typeof items === 'string' || Array.isArray(items)) {
      throw new TypeError(`[largeSync] - ${items} must be of type "Object"`)
    }

    const splitItems = split(items, maxBytesPerKey)

    const splitKeys = getKeys(splitItems)
    const reqKeys = getRequestKeys(getKeys(items))
    const removeKeys = reqKeys.filter(x => !splitKeys.includes(x))

    // remove keys that are no longer in use
    storage.remove(removeKeys)

    return storage.set(splitItems)
  },

  async remove(keys) {
    if (keys === null) {
      throw new TypeError(`[largeSync] - ${keys} must be of type "Object", "Array" or "String"`)
    }

    const removeKeys = getRequestKeys(getKeys(keys))
    return storage.remove(removeKeys)
  },

  async getBytesInUse(keys) {
    if (keys === null || keys === undefined) {
      return storage.getBytesInUse(null)
    } else {
      const objectKeys = getRequestKeys(getKeys(keys))
      return storage.getBytesInUse(objectKeys)
    }
  },

  async clear() {
    return storage.clear()
  },
}
