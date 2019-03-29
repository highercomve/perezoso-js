const LazyPrototype = {
  value: function () {
    return Array.from(this)
  }
}

const autoPartial = (func) => {
  const numberOfArguments = func.length
  const newFunc = (...args) => {
    return args.length < numberOfArguments
      ? autoPartial(func.bind(null, ...args))
      : func(...args)
  }
  Object.defineProperty(newFunc, 'length', {
    value: numberOfArguments,
    writable: false
  })
  return newFunc
}

const generate = autoPartial(function _generate (options, fn) {
  options = !options ? {} : options
  const dependency = options.dependency || LazyPrototype
  const descriptor = options.descriptor
  return Object.create(
    Object.assign({ [Symbol.iterator]: fn }, dependency),
    descriptor
  )
})

const compose = (fn, ...funcs) => {
  return (...args) => {
    return funcs.reduce((acc, func) => func(acc), fn(...args))
  }
}

module.exports.autoPartial = autoPartial
module.exports.generate = generate
module.exports.compose = compose
