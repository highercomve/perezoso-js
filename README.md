Perezoso JS
==========================================

This is an experiment for Lazy evaluation of map, reduce, filter over enumerables.

The library exports all the methods of Object Lazy.

The lazy will have all the methods that and has and overwritten all this:

- value(): returns and array from the enumerable
- map(fn): returns another enumerable with the map function
- reduce(fn, seed): returns the result of the reduce process, not a enumerable
- filter(fn): filter true the enumerables
- find(fn): return and element of the enumerable after find it
- first(): return the first element of the enumerable
- rest(): return the rest of the enumerable
- until(fn): iterate over and interator until the fn.call returns false
- take(n): return N elements of the enumerable starting from 0 to N

### How to use it

```js
import { Lazy } from 'perezoso-js'

var lazy = new Lazy(1,2,3,4,5)

lazy
  .map(x => x * x) // this will return an iterable with the map values
  .filter(x => x % 3 === 0) // this will return an itereable with multiples of 3
  .value() // return the evaluation of the iterable as an Array
// returns [ 9, 36 ]

// OR
var lazy2 = Lazy.from([1,2,3,4,5,6])

lazy2
  .map(x => x * x)
  .filter(x => x % 3 === 0)
  .value()

// returns [ 9, 36 ]
```

or could be used in a functional way (but we don't have pipeline operator yet) 
(https://github.com/tc39/proposal-pipeline-operator)[https://github.com/tc39/proposal-pipeline-operator]

```js
import { value, filter, map, compose } from 'perezoso-js'

value(
  filter(
    x => x % 3 === 0, 
    map(
      x => x * x,
      [1, 2, 3, 4, 5, 6]
    )
  )
)
// returns [ 9, 36 ]

// or you could do it using compose
compose(
  map.bind(null, x => x * x),
  filter.bind(null, x => x % 3 === 0),
  value
)([1, 2, 3, 4, 5, 6])
// returns [ 9, 36 ]
```

### You could create an Infinite iterator and use Lazy to do operations over

```js
import { generate } from 'perezoso-js'

var Numbers = generate(function () {
  let n = 0
  return {
    next: () => ({ done: false, value: n++ })
  }
})

const Fibonacci = generate(function () {
  let n1 = 0
  let n2 = 1
  let value
  return {
    next: () => {
      [value, n1, n2] = [n1, n2, n1 + n2]
      return { value }
    }
  }
})

const rangeFactory = (from, to = Infinity, step = 1) => {
  return generate(function () {
    let done = false
    let value = 0
    return {
      next () {
        value = from
        done = from >= to
        from = !done ? from + step : value
        return { done: done, value: value }
      }
    }
  })
}

rangeFactory(1, 100)
  .map(x => x * 2)
  .filter(x => x % 4 === 0)
  .take(10)
  .value()
// [ 4, 8, 12, 16, 20, 24, 28, 32, 36, 40 ]

Numbers
  .map(x => x * 2)
  .filter(x => x % 4 === 0)
  .take(10)
  .value()
// returns [ 0, 4, 8, 12, 16, 20, 24, 28, 32, 36 ]

Fibonacci
  .map(x => x * 2)
  .filter(x => x % 4 === 0)
  .take(10)
  .value()
 // returns 0, 4, 16, 68, 288, 1220, 5168, 21892, 92736, 392836 ]

```