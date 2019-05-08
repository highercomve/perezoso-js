module.exports.Factory = function Factory (generator) {
  return {
    includes,
    difference,
    all,
    map,
    reduce,
    filter,
    until,
    first,
    rest,
    take,
    value,
    find,
    uniq
  }

  /**
   * Get a iterator with the uniq values of another iterator,
   * This will return a funcion that receive the iterator
   * @param {Function} checker
   * @returns {Function}
   */
  function uniq (keyGenerator) {
    return (iterable) => {
      iterable = iterable || keyGenerator
      keyGenerator = keyGenerator ? keyGenerator : (acc, value) => {
        if (!acc[value]) {
          acc[value] = value
          return true
        }
        return false
      }
      return generator(() => {
        const iterator = iterable[Symbol.iterator]()
        const acc = {}
        return {
          next () {
            do {
              var { done, value } = iterator.next()
            } while (!done && !keyGenerator(acc, value))
            return { done, value }
          }
        }
      })
    }
  }

  /**
   * Validate if a value exist inside an iterable, we can use a function as first parameter to evaluate with that
   * if something exist in the Iterable
   * @param {Function | any} checker
   * @param {Iterable} iterable
   * @returns {boolean}
   */
  function includes (fn, iterable) {
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
    return result
  }

  /**
   * Calculates all the values in the first Iterable that are not inside the second one
   * @param {Iterable} first
   * @param {Iterable} second
   * @returns {Iterable}
   */
  function difference (first, second) {
    return generator(() => {
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

  /**
   * Returns true if in the whole iteration the checker function returns true
   * @param {Function} checker
   * @param {Iterable} iterable
   * @returns {boolean}
   */
  function all (fn, iterable) {
    const iterator = iterable[Symbol.iterator]()
    let result = true
    let done = false
    let iterationResult
    do {
      iterationResult = iterator.next()
      result = result && fn(iterationResult.value)
      done = iterationResult.done || !result
    } while (!done)
    return result
  }

  /**
   * Returns another iterable of the same size with every value mapper using the mapper funciton.
   * @param {Function} mapper
   * @param {Iterable} iterable
   * @return {Iterable}
   */
  function map (fn, iterable) {
    return generator(() => {
      const iterator = iterable[Symbol.iterator]()

      return {
        next: () => {
          const { done, value } = iterator.next()

          return ({ done, value: done ? undefined : fn(value) })
        }
      }
    })
  }

  /**
   * Reduce a interator using the reducer function
   * @param {Function} reducer
   * @param {any} seed the starting point for the reducing process
   * @param {Iterable} iterable
   * @return {any} accumulator
   */
  function reduce (fn, seed, iterable) {
    const iterator = iterable[Symbol.iterator]()
    let iterationResult
    let accumulator = seed
    do {
      iterationResult = iterator.next()
      accumulator = iterationResult.done ? accumulator : fn(accumulator, iterationResult.value)
    } while (!iterationResult.done)
    return accumulator
  }

  /**
   * Filter an iterable and get all values where filter function returns true
   * @param {Function} filter
   * @param {Iterable} iterable
   * @return {Iterable}
   */
  function filter (fn, iterable) {
    return generator(() => {
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

  /**
   * Return another Iterable with all the elements until the untilFunction return true
   * @param {Function} untilFunction
   * @param {Iterable} iterable
   * @returns {Iterable}
   */
  function until (fn, iterable) {
    return generator(() => {
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

  /**
   * Returns the first element of an iterable
   * @param {Iterable} iterable
   * @return {any}
   */
  function first (iterable) {
    return iterable[Symbol.iterator]().next().value
  }

  /**
   * Returns the rest of and iterable
   * @param {Iterable} iterable
   * @return {Iterable}
   */
  function rest (iterable) {
    return generator(() => {
      const iterator = iterable[Symbol.iterator]()

      iterator.next()
      return iterator
    })
  }

  /**
   * Returns an iterable with exactly N values of the iterable argument
   * @param {Number} N
   * @param {Iterable} iterable
   * @returns {Iterable}
   */
  function take (numberToTake, iterable) {
    return generator(() => {
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

  /**
   * Returns an array of one iterable
   * @param {Iterable} iterable
   * @returns {Array}
   */
  function value (iterable) {
    return Array.from(iterable)
  }

  /**
   * Returns a value where the validation funcition returns true. The first time it happens
   * @param {Function} validation
   * @param {Iterable} iterable
   * @returns {any}
   */
  function find (fn, iterable) {
    return filter(fn, iterable).first()
  }
}
