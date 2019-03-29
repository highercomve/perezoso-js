const { Factory } = require('./base')
const { generate } = require('./helpers')

const LazyPrototype = {
  value: function () {
    return lib.value(this)
  },
  map: function (fn) {
    return lib.map(fn, this)
  },
  reduce: function (fn, seed) {
    return lib.reduce(fn, seed, this)
  },
  filter: function (fn) {
    return lib.filter(fn, this)
  },
  find: function (fn) {
    return lib.filter(fn, this).first()
  },
  first: function () {
    return lib.first(this)
  },
  rest: function () {
    return lib.rest(this)
  },
  until: function (fn) {
    return lib.until(fn, this)
  },
  take: function (numberToTake) {
    return lib.take(numberToTake, this)
  },
  includes: function (fn) {
    return lib.includes(fn, this)
  },
  all: function (fn) {
    return lib.all(fn, this)
  },
  difference: function (first, second) {
    return lib.difference(first, second)
  }
}

const LazyDescriptor = Object.keys(LazyPrototype).reduce((acc, key) => {
  acc[key] = { value: LazyPrototype[key] }
  return acc
}, {})

const options = { dependency: LazyPrototype }
const generator = generate(options)
const lib = Factory(generator)

function Lazy () {
  this.push.apply(this, arguments)
}

Lazy.prototype = Object.create(Array.prototype, Object.assign({
  constructor: {
    value: Lazy
  }
}, LazyDescriptor))

Lazy.from = function (iterable) {
  const lazy = new Lazy()

  for (let element of iterable) {
    lazy.push(element)
  }
  return lazy
}

module.exports.Lazy = Lazy
module.exports.LazyDescriptor = LazyDescriptor
module.exports.generate = (fn, opts = options) => generate(opts, fn)
