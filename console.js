const repl = require('repl')
const path = require('path')
const glob = require('glob')
const history = require('repl.history')
var historyFile = path.join(__dirname, '.node_history')

// Load all modules in src
function loadVariables () {
  const AllJsFilesPattern = path.join(__dirname, './src/**/*.js')
  const allSrcFiles = glob.sync(AllJsFilesPattern)
  return allSrcFiles.reduce(function (contextSum, file) {
    const module = path.basename(file, '.js')
    contextSum[module] = require(file)
    return contextSum
  }, {})
}

const initialContext = loadVariables()

const replServer = repl.start({
  terminal: true,
  prompt: 'Perezoso Console > '
})

history(replServer, historyFile)

Object.assign(replServer.context, initialContext)

function reload () {
  Object.assign(replServer.context, loadVariables())
}

replServer.context.reload = reload
