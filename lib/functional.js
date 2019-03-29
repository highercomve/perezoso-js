const { Factory } = require('./base')
const { autoPartial, generate, compose } = require('./helpers')

const lib = Factory(generate({}))

Object.keys(lib).forEach((key) => {
  module.exports[key] = autoPartial(lib[key])
})

module.exports.compose = compose
module.exports.generate = (fn, options) => generate(options, fn)
