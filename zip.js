const path = require('path')
const zip = require('cross-zip')

const inPath = path.join(__dirname, './dist')
const outPath = path.join(__dirname, 'chorme-extension.zip')

zip.zipSync(inPath, outPath)
