Perezoso JS
==========================================

This is an experiment over iterators for Lazy evaluation of map, reduce, filter over iterators.

The library have and Object that extends from Array called LazyArray and a module of functions called Lazy

The lazy array will have all the methods that and array has and overwritten all this:

- value(): returns and array from the iterator
- map(fn): returns another iterator with the map function
- reduce(fn, seed): returns the result of the reduce process, not a iterator
- filter(fn): filter true the iterators
- find(fn): return and element of the iterator after find it
- first(): return the first element of the iterator
- rest(): return the rest of the iterator
- until(fn): iterate over and interator until the fn.call returns false
- take(n): return N elements of the iterator starting from 0 to N

### How to use it

```js
import { LazyArray } from 'perezoso-js'

var lazy = new LazyArray(1,2,3,4,5)

lazy
  .map(x => x * x) // this will return an iterable with the map values
  .filter(x => x % 3 === 0) // this will return an itereable with multiples of 3
  .value() // return the evaluation of the iterable as an Array
// returns [ 9, 36 ]

// OR
var lazy2 = LazyArray.from([1,2,3,4,5,6])

lazy2
  .map(x => x * x)
  .filter(x => x % 3 === 0)
  .value()

// returns [ 9, 36 ]
```

or could be used in a functional way (but we don't have pipeline operator yet) 
(https://github.com/tc39/proposal-pipeline-operator)[https://github.com/tc39/proposal-pipeline-operator]

```js
import { Lazy } from 'perezoso-js'

Lazy.value(
  Lazy.filter(
    x => x % 3 === 0, 
    Lazy.map(
      x => x * x,
      [1, 2, 3, 4, 5, 6]
    )
  )
)
// returns [ 9, 36 ]

// or you could do it using compose
Lazy.compose(
  Lazy.map.bind(null, x => x * x),
  Lazy.filter.bind(null, x => x % 3 === 0),
  Lazy.value
)([1, 2, 3, 4, 5, 6])
// returns [ 9, 36 ]
```

### You could create an Infinite iterator and use Lazy to do operations over

```js
import { Lazy } from 'perezoso-js'

var Numbers = Lazy.generate(function () {
  let n = 0
  return {
    next: () => ({ done: false, value: n++ })
  }
})

const Fibonacci = Lazy.generate(function () {
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