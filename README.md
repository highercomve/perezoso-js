[![Codeship Status for highercomve/perezoso-js](https://app.codeship.com/projects/7a30a1f0-69eb-0137-1d6a-3699c784bbf0/status?branch=master)](https://app.codeship.com/projects/346251)

Perezoso JS
==========================================

This library expose a series of methods like any array methods but using enumerators

We have to forms of using it 

One if using everything as functions or using and object Lazy

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
import { value, filter, map, compose } from 'perezoso-js/functional'

compose(
  map(x => x * x),
  filter(x => x % 3 === 0),
  value
)([1, 2, 3, 4, 5, 6])

// returns [ 9, 36 ]
```

### You could create an Infinite iterator and use Lazy to do operations over

```js
import { generate } from 'perezoso-js'

const Numbers = generate(function () {
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
