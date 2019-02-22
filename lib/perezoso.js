const LazyIterable = {
  value: function () { return Array.from(this) },
  map: function (fn) {
    return mapIterableWith(fn, this)
  },
  reduce: function (fn, seed) {
    return reduceIterableWith(fn, seed, this)
  },
  filter: function (fn) {
    return filterIterableWith(fn, this)
  },
  find: function (fn) {
    return filterIterableWith(fn, this).first()
  },
  first: function () {
    return firstIterable(this)
  },
  rest: function () {
    return restIterable(this)
  },
  until: function (fn) {
    return untilIterable(fn, this)
  },
  take: function (numberToTake) {
    return takeIterable(numberToTake, this)
  }
}

const LazyIterableConf = Object.keys(LazyIterable).reduce((acc, key) => {
  acc[key] = { value: LazyIterable[key] }
  return acc
}, {})

const mapIterableWith = (fn, iterable) => {
  return Object.create(LazyIterable, {
    [Symbol.iterator]: {
      value: () => {
        const iterator = iterable[Symbol.iterator]()

        return {
          next: () => {
            const { done, value } = iterator.next()

            return ({ done, value: done ? undefined : fn(value) })
          }
        }
      }
    }
  })
}

const reduceIterableWith = (fn, seed, iterable) => {
  const iterator = iterable[Symbol.iterator]()
  let iterationResult
  let accumulator = seed
  do {
    iterationResult = iterator.next()
    accumulator = iterationResult.done ? accumulator : fn(accumulator, iterationResult.value)
  } while (!iterationResult.done)
  return accumulator
}

const filterIterableWith = (fn, iterable) => {
  return Object.create(LazyIterable, {
    [Symbol.iterator]: {
      value: () => {
        const iterator = iterable[Symbol.iterator]()

        return {
          next: () => {
            do {
              var { done, value } = iterator.next()
            } while (!done && !fn(value))
            return { done, value }
          }
        }
      }
    }
  })
}

const untilIterable = (fn, iterable) => {
  return Object.create(LazyIterable, {
    [Symbol.iterator]: {
      value: () => {
        const iterator = iterable[Symbol.iterator]()

        return {
          next: () => {
            let { done, value } = iterator.next()

            done = done || fn(value)

            return ({ done, value: done ? undefined : value })
          }
        }
      }
    }
  })
}

const firstIterable = (iterable) => {
  return iterable[Symbol.iterator]().next().value
}

const restIterable = (iterable) => {
  return Object.create(LazyIterable, {
    [Symbol.iterator]: {
      value: () => {
        const iterator = iterable[Symbol.iterator]()

        iterator.next()
        return iterator
      }
    }
  })
}

const takeIterable = (numberToTake, iterable) => {
  return Object.create(LazyIterable, {
    [Symbol.iterator]: {
      value: () => {
        const iterator = iterable[Symbol.iterator]()
        let remainingElements = numberToTake

        return {
          next: () => {
            let { done, value } = iterator.next()

            done = done || remainingElements-- <= 0

            return ({ done, value: done ? undefined : value })
          }
        }
      }
    }
  })
}

const getValue = function (iterable) {
  return Array.from(iterable)
}

function LazyArray () {
  this.push.apply(this, arguments)
}

LazyArray.prototype = Object.create(Array.prototype, Object.assign({
  constructor: {
    value: LazyArray
  },
  [Symbol.iterator]: {
    value: function () {
      let iterationIndex = -1
      return {
        next: () => {
          if (iterationIndex < 0) {
            iterationIndex = 0
          }
          if (iterationIndex >= this.length) {
            return { done: true }
          } else {
            return { done: false, value: this[iterationIndex++] }
          }
        }
      }
    }
  }
}, LazyIterableConf))

LazyArray.from = function (iterable) {
  const lazy = new LazyArray()

  for (let element of iterable) {
    lazy.push(element)
  }
  return lazy
}

const compose = (fn, ...funcs) => {
  return (...args) => {
    return funcs.reduce((acc, func) => func(acc), fn(...args))
  }
}

const generate = (fn) => {
  return Object.create(LazyIterable, {
    [Symbol.iterator]: {
      value: fn
    }
  })
}

module.exports.LazyArray = LazyArray
module.exports.Lazy = {
  generate: generate,
  compose: compose,
  take: takeIterable,
  map: mapIterableWith,
  reduce: reduceIterableWith,
  first: firstIterable,
  rest: restIterable,
  getValue: getValue,
  until: untilIterable,
  filter: filterIterableWith,
  find: (fn) => filterIterableWith(fn, this).first(),
  value: iterable => Array.from(iterable)
}
