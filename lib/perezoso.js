const LazyPrototype = {
  value: function () {
    return value(this)
  },
  map: function (fn) {
    return map(fn, this)
  },
  reduce: function (fn, seed) {
    return reduce(fn, seed, this)
  },
  filter: function (fn) {
    return filter(fn, this)
  },
  find: function (fn) {
    return filter(fn, this).first()
  },
  first: function () {
    return first(this)
  },
  rest: function () {
    return rest(this)
  },
  until: function (fn) {
    return until(fn, this)
  },
  take: function (numberToTake) {
    return take(numberToTake, this)
  },
  includes: function (fn) {
    return includes(fn, this)
  },
  all: function (fn) {
    return all(fn, this)
  },
  difference: function (first, second) {
    return difference(first, second)
  }
}

const LazyDescriptor = Object.keys(LazyPrototype).reduce((acc, key) => {
  acc[key] = { value: LazyPrototype[key] }
  return acc
}, {})

const compose = (fn, ...funcs) => {
  return (...args) => {
    return funcs.reduce((acc, func) => func(acc), fn(...args))
  }
}

const generate = (fn, dependency = LazyPrototype, descriptor) => {
  return Object.create(
    Object.assign({ [Symbol.iterator]: fn }, dependency),
    descriptor
  )
}

const map = (fn, iterable) => {
  return generate(() => {
    const iterator = iterable[Symbol.iterator]()

    return {
      next: () => {
        const { done, value } = iterator.next()

        return ({ done, value: done ? undefined : fn(value) })
      }
    }
  })
}

const reduce = (fn, seed, iterable) => {
  const iterator = iterable[Symbol.iterator]()
  let iterationResult
  let accumulator = seed
  do {
    iterationResult = iterator.next()
    accumulator = iterationResult.done ? accumulator : fn(accumulator, iterationResult.value)
  } while (!iterationResult.done)
  return accumulator
}

const filter = (fn, iterable) => {
  return generate(() => {
    const iterator = iterable[Symbol.iterator]()

    return {
      next: () => {
        do {
          var { done, value } = iterator.next()
        } while (!done && !fn(value))
        return { done, value }
      }
    }
  })
}

const until = (fn, iterable) => {
  return generate(() => {
    const iterator = iterable[Symbol.iterator]()

    return {
      next: () => {
        let { done, value } = iterator.next()
        done = done || fn(value)
        return ({ done, value: done ? undefined : value })
      }
    }
  })
}

const includes = (fn, iterable) => {
  const iterator = iterable[Symbol.iterator]()
  let result = false
  let done = false
  let iterationResult
  fn = typeof fn !== 'function' ? (val) => val === fn : fn
  do {
    iterationResult = iterator.next()
    result = result && fn(iterationResult.value)
    done = iterationResult.done || !result
  } while (!done)
}

const difference = (first, second) => {
  return generate(() => {
    const toFilterOut = new Set(second)
    const iterator = first[Symbol.iterator]()
    function getNext () {
      const { done, value } = iterator.next()
      if (!done && toFilterOut.has(value)) {
        return getNext()
      }
      return { done, value }
    }
    return {
      next () {
        const { done, value } = getNext()
        return { done, value }
      }
    }
  })
}

const all = (fn, iterable) => {
  const iterator = iterable[Symbol.iterator]()
  let result = true
  let done = false
  let iterationResult
  do {
    iterationResult = iterator.next()
    result = result && fn(iterationResult.value)
    done = iterationResult.done || !result
  } while (!done)
}

const first = (iterable) => {
  return iterable[Symbol.iterator]().next().value
}

const rest = (iterable) => {
  return generate(() => {
    const iterator = iterable[Symbol.iterator]()

    iterator.next()
    return iterator
  })
}

const take = (numberToTake, iterable) => {
  return generate(() => {
    const iterator = iterable[Symbol.iterator]()
    let remainingElements = numberToTake

    return {
      next: () => {
        let { done, value } = iterator.next()

        done = done || remainingElements-- <= 0

        return ({ done, value: done ? undefined : value })
      }
    }
  })
}

const value = function (iterable) {
  return Array.from(iterable)
}

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
const find = (fn) => filter(fn, this).first()

module.exports.Lazy = Lazy
module.exports.LazyDescriptor = LazyDescriptor
module.exports.generate = generate
module.exports.compose = compose
module.exports.take = take
module.exports.map = map
module.exports.reduce = reduce
module.exports.first = first
module.exports.rest = rest
module.exports.value = value
module.exports.until = until
module.exports.filter = filter
module.exports.find = find
module.exports.value = value
