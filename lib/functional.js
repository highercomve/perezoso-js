function autoPartial (func) {
  const numberOfArguments = func.length
  return (...args) => {
    return args.length < numberOfArguments
      ? autoPartial(func.bind(null, ...args))
      : func(...args)
  }
}

const LazyPrototype = {
  value: function () {
    return value(this)
  }
}

const compose = (fn, ...funcs) => {
  return (...args) => {
    return funcs.reduce((acc, func) => func(acc), fn(...args))
  }
}

function generate (fn, dependency = LazyPrototype, descriptor) {
  return Object.create(
    Object.assign({ [Symbol.iterator]: fn }, dependency),
    descriptor
  )
};

const includes = autoPartial(function _includes (fn, iterable) {
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
})

const difference = autoPartial(function _difference (first, second) {
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
})

const all = autoPartial(function _all (fn, iterable) {
  const iterator = iterable[Symbol.iterator]()
  let result = true
  let done = false
  let iterationResult
  do {
    iterationResult = iterator.next()
    result = result && fn(iterationResult.value)
    done = iterationResult.done || !result
  } while (!done)
})

const map = autoPartial(function _map (fn, iterable) {
  return generate(() => {
    const iterator = iterable[Symbol.iterator]()

    return {
      next: () => {
        const { done, value } = iterator.next()

        return ({ done, value: done ? undefined : fn(value) })
      }
    }
  })
})

const reduce = autoPartial(function _reduce (fn, seed, iterable) {
  const iterator = iterable[Symbol.iterator]()
  let iterationResult
  let accumulator = seed
  do {
    iterationResult = iterator.next()
    accumulator = iterationResult.done ? accumulator : fn(accumulator, iterationResult.value)
  } while (!iterationResult.done)
  return accumulator
})

const filter = autoPartial(function _filter (fn, iterable) {
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
})

const until = autoPartial(function _until (fn, iterable) {
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
})

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

const take = autoPartial(function _take (numberToTake, iterable) {
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
})

const value = (iterable) => {
  return Array.from(iterable)
}

const find = autoPartial(function _find (fn, iterable) {
  return filter(fn, iterable).first()
})

module.exports.generate = generate
module.exports.compose = compose
module.exports.includes = includes
module.exports.difference = difference
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
module.exports.all = all
