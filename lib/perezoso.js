const LazyIterable = {
  value: {
    value: function () { return Array.from(this) }
  },
  map: {
    value: function (fn) {
      return mapIterableWith(this, fn)
    }
  },
  reduce: {
    value: function (seed, fn) {
      return reduceIterableWith(this, seed, fn)
    }
  },
  filter: {
    value: function (fn) {
      return filterIterableWith(this, fn)
    }
  },
  find: {
    value: function (fn) {
      return filterIterableWith(this, fn).first()
    }
  },
  first: {
    value: function () {
      return firstIterable(this)
    }
  },
  rest: {
    value: function () {
      return restIterable(this)
    }
  },
  until: {
    value: function (fn) {
      return untilIterable(this, fn)
    }
  },
  take: {
    value: function (numberToTake) {
      return takeIterable(this, numberToTake)
    }
  }
}

const mapIterableWith = (iterable, fn) => {
  return Object.create({
    [Symbol.iterator]: () => {
      const iterator = iterable[Symbol.iterator]()

      return {
        next: () => {
          const { done, value } = iterator.next()

          return ({ done, value: done ? undefined : fn(value) })
        }
      }
    }
  }, LazyIterable)
}

const reduceIterableWith = (iterable, seed, fn) => {
  const iterator = iterable[Symbol.iterator]()
  let iterationResult
  let accumulator = seed

  while ((iterationResult = iterator.next(), !iterationResult.done)) {
    accumulator = fn(accumulator, iterationResult.value)
  }
  return accumulator
}

const filterIterableWith = (iterable, fn) => {
  return Object.create({
    [Symbol.iterator]: () => {
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
  }, LazyIterable)
}

const untilIterable = (iterable, fn) => {
  return Object.create({
    [Symbol.iterator]: () => {
      const iterator = iterable[Symbol.iterator]()

      return {
        next: () => {
          let { done, value } = iterator.next()

          done = done || fn(value)

          return ({ done, value: done ? undefined : value })
        }
      }
    }
  }, LazyIterable)
}

const firstIterable = (iterable, fn) => {
  return iterable[Symbol.iterator]().next().value
}

const restIterable = (iterable) => {
  return Object.create({
    [Symbol.iterator]: () => {
      const iterator = iterable[Symbol.iterator]()

      iterator.next()
      return iterator
    }
  }, LazyIterable)
}

const takeIterable = (numberToTake, iterable) => {
  return Object.create({
    [Symbol.iterator]: () => {
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
  }, LazyIterable)
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
}, LazyIterable))

LazyArray.from = function (iterable) {
  const lazy = new LazyArray()

  for (let element of iterable) {
    lazy.push(element)
  }
  return lazy
}

module.exports.LazyArray = LazyArray
